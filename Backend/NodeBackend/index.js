import express from "express";
import passport from "passport";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import XLSX from "xlsx";
import fs from "fs";
import axios from "axios";
import archiver from "archiver";
import pool from "./mysqlConfig.js";

dotenv.config();
const app = express();

/* ================= BODY SIZE FIX ================= */
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

/* ================= CORS ================= */
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

/* ===== FORCE CORS HEADERS ===== */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

/* ================= SESSION ================= */
app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: { httpOnly: true, sameSite: "lax" },
    })
);

app.use(passport.initialize());
app.use(passport.session());

/* ================= GOOGLE AUTH ================= */
passport.use(
    new GoogleStrategy({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "http://localhost:5000/auth/google/callback",
        },
        (accessToken, refreshToken, profile, done) => {
            const email = profile.emails[0].value;
            if (!email.endsWith("@nitj.ac.in")) return done(null, false);
            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

/* ================= AUTH ================= */
const isLoggedIn = (req, res, next) => {
    if (req.user) return next();
    res.status(401).json({ error: "Not authenticated" });
};

app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "http://localhost:5173/login" }),
    (req, res) => res.redirect("http://localhost:5173/control-center")
);

app.get("/auth/status", (req, res) => res.json({ loggedIn: !!req.user }));
app.get("/auth/logout", (req, res) => req.logout(() => res.redirect("http://localhost:5173/login")));

/* ================= EXCEL UPLOAD ================= */
const upload = multer({ dest: "uploads/" });

app.post("/api/upload", isLoggedIn, upload.single("file"), async(req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const filePath = req.file.path;

    try {
        const workbook = XLSX.readFile(filePath);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);

        const conn = await pool.getConnection();

        for (const row of rows) {
            if (!row["Subject Code"] || !row["Roll No."]) continue;

            const rawCode = row["Subject Code"];
            const cleanCode = rawCode.replace(/[^a-zA-Z0-9]/g, "");
            const tableName = `subject_${cleanCode}`;

            await conn.query(`
        CREATE TABLE IF NOT EXISTS \`${tableName}\` (
          id INT AUTO_INCREMENT PRIMARY KEY,
          roll_no VARCHAR(20),
          name VARCHAR(100),
          course VARCHAR(50),
          branch VARCHAR(100),
          semester INT,
          subject_code VARCHAR(20),
          subject_title VARCHAR(200)
        )
      `);

            await conn.query(
                `INSERT INTO \`${tableName}\`
         (roll_no, name, course, branch, semester, subject_code, subject_title)
         VALUES (?, ?, ?, ?, ?, ?, ?)`, [
                    row["Roll No."],
                    row["Name"],
                    row["Course"],
                    row["Branch"],
                    row["Semester"],
                    rawCode,
                    row["Subject Title"],
                ]
            );
        }

        conn.release();
        fs.unlinkSync(filePath);
        res.json({ success: true });

    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ error: "Excel upload failed" });
    }
});

/* ================= ALLOCATE (FIXED) ================= */
app.post("/allocate", async(req, res) => {
    try {
        const {
            programme,
            year,
            time,
            datesheet,
            subjectPairsByDate
        } = req.body;
        const springURL = "http://localhost:8081/allocate";
        const results = [];

        for (const date of Object.keys(datesheet)) {
            const payload = {
                programme,
                year,
                date,
                time,
                subjects: datesheet[date],
                subjectPairs:
                    (subjectPairsByDate && subjectPairsByDate[date]) || []
            };

            const response = await axios.post(springURL, payload);
            results.push({ date, response: response.data });
        }


        const fullResponse = { success: true, results };

        // Save entire allocation to history
        try {
            await axios.post("http://localhost:8081/api/history/save", fullResponse);
        } catch (histErr) {
            console.error("Failed to save history:", histErr.message);
        }

        res.json(fullResponse);

    } catch (err) {
        const springMsg =
            (err.response &&
                err.response.data &&
                err.response.data.message) ||
            err.message;


        if (springMsg.includes("Rooms exhausted")) {
            return res.status(400).json({
                error: "Not enough seats available. Please add more rooms or reduce subjects.",
            });
        }

        res.status(500).json({
            error: "Allocation failed",
            details: springMsg,
        });
    }
});

/* ================= REALLOCATE (ROLLBACK + ALLOCATE) ================= */
app.post("/allocate/reallocate", async(req, res) => {
    try {
        const {
            programme,
            year,
            time,
            datesheet,
            subjectPairsByDate
        } = req.body;

        const results = [];

        // 🔥 CALL SPRING REALLOCATE (rollback + allocate handled there)
        for (const date of Object.keys(datesheet)) {

            const payload = {
                programme,
                year,
                date,
                time,
                subjects: datesheet[date],
                subjectPairs:
                    (subjectPairsByDate && subjectPairsByDate[date]) || []
            };

            const response = await axios.post(
                "http://localhost:8081/allocate/reallocate",
                payload
            );

            results.push({ date, response: response.data });
        }

        res.json({ success: true, results });

    } catch (err) {

        const springMsg =
            err.response &&
            err.response.data &&
            err.response.data.message ?
            err.response.data.message :
            err.message;


        if (springMsg.includes("Rooms exhausted")) {
            return res.status(400).json({
                error: "Not enough seats available. Please add more rooms or reduce subjects."
            });
        }

        res.status(500).json({
            error: "Reallocation failed",
            details: springMsg
        });
    }
});



/* ================= HISTORY ENDPOINTS ================= */

// Get all previous plans
app.get("/api/history", isLoggedIn, async(req, res) => {
    try {
        const response = await axios.get("http://localhost:8081/api/history");
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
});

// Get specific plan by index
app.get("/api/history/:index", isLoggedIn, async(req, res) => {
    try {
        const response = await axios.get(`http://localhost:8081/api/history/${req.params.index}`);
        res.json(response.data);
    } catch (err) {
        res.status(404).json({ error: "Plan not found" });
    }
});

// Delete plan by index
app.delete("/api/history/:index", isLoggedIn, async(req, res) => {
    try {
        const response = await axios.delete(`http://localhost:8081/api/history/${req.params.index}`);
        res.json(response.data);
    } catch (err) {
        res.status(500).json({ error: "Failed to delete plan" });
    }
});

/* ================= DOWNLOAD ZIP ROUTES ================= */

// ---------- PDF ZIP ----------
app.post("/api/download/pdf", async(req, res) => {
    try {
        const springRes = await axios.post(
            "http://localhost:8081/api/export/pdf", { results: req.body.results }, { maxBodyLength: Infinity, maxContentLength: Infinity }
        );

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=room_pdfs.zip");

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);

        springRes.data.forEach(file => {
            if (!file.fileName || !file.fileData) return;

            archive.append(
                Buffer.from(file.fileData, "base64"), { name: file.fileName }
            );
        });

        await archive.finalize();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "PDF download failed" });
    }
});

// ---------- EXCEL ZIP ----------
app.post("/api/download/excel", async(req, res) => {
    try {
        const springRes = await axios.post(
            "http://localhost:8081/api/export/excel", { results: req.body.results }, { maxBodyLength: Infinity, maxContentLength: Infinity }
        );

        res.setHeader("Content-Type", "application/zip");
        res.setHeader("Content-Disposition", "attachment; filename=room_excels.zip");

        const archive = archiver("zip", { zlib: { level: 9 } });
        archive.pipe(res);

        springRes.data.forEach(file => {
            if (!file.fileName || !file.fileData) return;

            archive.append(
                Buffer.from(file.fileData, "base64"), { name: file.fileName }
            );
        });

        await archive.finalize();

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Excel download failed" });
    }
});

app.get("/", (req, res) => res.send("Backend running 🚀"));

app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));