import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubmitDetails.css";
import axios from "axios";
import * as XLSX from "xlsx";

export default function SubmitDetails() {
  const navigate = useNavigate();

  const [programme, setProgramme] = useState("");
  const [year, setYear] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [startPeriod, setStartPeriod] = useState("AM");
  const [endPeriod, setEndPeriod] = useState("PM");

  const [roomSelection, setRoomSelection] = useState("all");
  const [includeRooms, setIncludeRooms] = useState("");
  const [excludeRooms, setExcludeRooms] = useState("");

  const [datesheet, setDatesheet] = useState(null);
  const [yearOptions, setYearOptions] = useState([]);
  const [yearDisabled, setYearDisabled] = useState(true);

  /* ================= YEAR OPTIONS ================= */
  const updateYears = (p) => {
    let years = [];
    if (p === "btech") years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
    else if (["mtech", "msc", "mba"].includes(p))
      years = ["1st Year", "2nd Year"];
    else if (p === "phd")
      years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

    setYearOptions(years);
    setYearDisabled(!years.length);
  };

  const handleProgrammeChange = (e) => {
    setProgramme(e.target.value);
    setYear("");
    updateYears(e.target.value);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  /* ================= DATE SHEET PARSER ================= */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    console.log("📂 File Selected:", file.name);

    const reader = new FileReader();

    reader.onload = (evt) => {
      console.log("📖 File Loaded");

      const workbook = XLSX.read(evt.target.result, { type: "binary" });

      let targetSheet = null;
      let headerRowIdx = -1;
      let dateColIdx = -1;

      // Scan all sheets in the workbook to dynamically locate the date sheet table
      for (const name of workbook.SheetNames) {
        const sheet = workbook.Sheets[name];
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        for (let r = 0; r < rows.length; r++) {
          const row = rows[r];
          if (!row) continue;
          const colIdx = row.findIndex((c) => {
            const val = String(c).trim().toLowerCase();
            return (
              val === "date" ||
              val === "date/day" ||
              val === "date & time" ||
              val === "exam date" ||
              val === "dates"
            );
          });
          if (colIdx !== -1) {
            targetSheet = sheet;
            headerRowIdx = r;
            dateColIdx = colIdx;
            console.log(`Found Date header in sheet '${name}' at row ${r}, col ${colIdx}`);
            break;
          }
        }
        if (targetSheet) break;
      }

      // Fallback to first sheet if no explicit header cell was found
      if (!targetSheet) {
        targetSheet = workbook.Sheets[workbook.SheetNames[0]];
        headerRowIdx = 0;
        dateColIdx = 0;
      }

      const rows = XLSX.utils.sheet_to_json(targetSheet, {
        header: 1,
        defval: "",
      });

      console.log("📊 Total Rows in target sheet:", rows.length);

      const parsed = {};

      for (let i = headerRowIdx + 1; i < rows.length; i++) {
        const row = rows[i];
        if (!row) continue;

        const rawDate = row[dateColIdx];
        if (rawDate === undefined || rawDate === null || String(rawDate).trim() === "") continue;

        let date;

        if (typeof rawDate === "number") {
          const d = XLSX.SSF.parse_date_code(rawDate);
          date = `${String(d.d).padStart(2, "0")}-${String(d.m).padStart(2, "0")}-${d.y}`;
        } else {
          date = String(rawDate).trim().split("\n")[0];
        }

        const subjects = [];

        // Scan all non-date cells in the row for subject codes
        for (let j = 0; j < row.length; j++) {
          if (j === dateColIdx) continue;
          if (!row[j]) continue;

          const cellValue = String(row[j]).trim();

          // Extract all subject codes (supports single & multi-subject cells separated by newlines, commas, slashes, or spaces)
          const matches = cellValue.match(/[A-Z]{2,}\d{3,4}[A-Z]?/g);
          if (matches) {
            matches.forEach((m) => subjects.push(m));
          }
        }

        if (subjects.length) {
          parsed[date] = [...new Set(subjects)];
        }
      }

      console.log("=========== FINAL PARSED SUBJECT CODES ===========");
      console.log(parsed);

      Object.entries(parsed).forEach(([date, subjects]) => {
        console.log("Date:", date);
        subjects.forEach((sub, index) => {
          console.log(`   ${index + 1}. [${sub}] length=${sub.length}`);
        });
      });

      console.log("===========================================");

      if (Object.keys(parsed).length === 0) {
        alert("Could not parse any valid subject codes from the uploaded file.");
      } else {
        setDatesheet(parsed);
        alert(`Datesheet uploaded successfully! (${Object.keys(parsed).length} exam date(s) parsed)`);
      }
    };

    reader.readAsBinaryString(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🚀 Submit Clicked");
    console.log("Programme:", programme);
    console.log("Year:", year);
    console.log("Datesheet:", datesheet);

    if (!datesheet || Object.keys(datesheet).length === 0) {
      alert("Datesheet is empty or not parsed.");
      return;
    }

    const payload = {
      programme,
      year,
      time: `${startTime} ${startPeriod} - ${endTime} ${endPeriod}`,
      datesheet,
      roomSelection,
      includeRooms,
      excludeRooms,
    };

    console.log("📦 Payload Being Sent:", payload);

    try {
      sessionStorage.setItem("allocationRequest", JSON.stringify(payload));

      const res = await axios.post(
        "http://localhost:5000/allocate",
        payload,
        { withCredentials: true }
      );

      console.log("📥 Backend Response:", res.data);

      sessionStorage.setItem("allocationPayload", JSON.stringify(res.data));
      sessionStorage.setItem("hasAllocated", "true");

      console.log(
        "💾 Stored allocationPayload:",
        sessionStorage.getItem("allocationPayload")
      );

      navigate("/room-allocation", { state: res.data });

    } catch (err) {
      console.error("❌ Allocation Error:", err);
      alert(
        err.response?.data?.details ||
          err.response?.data?.error ||
          "Seat allocation failed. Please check room availability."
      );
    }
  };

  return (
    <div>
      {/* HEADER */}
      <header className="header">
        <img src="/nitjlogo.png" alt="NITJ Logo" />
      </header>

      {/* NAVBAR */}
      <div className="nav-bar">
        <div className="nav-left">
          <img src="/seating planner logo.png" alt="" />
          <span>| SEATING PLANNER - NITJ |</span>
        </div>
        <div className="nav-right">
          <a href="#contact">CONTACT US</a>
          <a href="#" onClick={handleLogout}>LOG OUT</a>
        </div>
      </div>

      {/* MAIN */}
      <main className="submit-container">
        <section className="submit-card">
          <h2>PROVIDE EXAM DETAILS</h2>

          <form onSubmit={handleSubmit}>

            {/* Programme */}
            <div className="form-group">
              <label>Programme</label>
              <select
                className="form-control"
                value={programme}
                onChange={handleProgrammeChange}
                required
              >
                <option value="">-- Select Programme --</option>
                <option value="btech">B.Tech</option>
                <option value="mtech">M.Tech</option>
                <option value="msc">M.Sc</option>
                <option value="mba">MBA</option>
                <option value="phd">Ph.D</option>
              </select>
            </div>

            {/* Year */}
            <div className="form-group">
              <label>Year</label>
              <select
                className="form-control"
                disabled={yearDisabled}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">-- Select Year --</option>
                {yearOptions.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            {/* Time */}
            <div className="form-group">
              <label>Exam Time</label>
              <div style={{ display: "flex", gap: 10 }}>
                <input
                  className="form-control"
                  style={{ width: "30%" }}
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
                <select
                  className="form-control"
                  style={{ width: "20%" }}
                  value={startPeriod}
                  onChange={(e) => setStartPeriod(e.target.value)}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
                <input
                  className="form-control"
                  style={{ width: "30%" }}
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
                <select
                  className="form-control"
                  style={{ width: "20%" }}
                  value={endPeriod}
                  onChange={(e) => setEndPeriod(e.target.value)}
                >
                  <option>AM</option>
                  <option>PM</option>
                </select>
              </div>
            </div>

            {/* Rooms */}
            <div className="form-group">
              <label>Rooms</label>
              <select
                className="form-control"
                value={roomSelection}
                onChange={(e) => setRoomSelection(e.target.value)}
              >
                <option value="all">All Rooms</option>
                <option value="include">Include Rooms</option>
                <option value="exclude">Exclude Rooms</option>
              </select>
            </div>

            {roomSelection === "include" && (
              <div className="form-group">
                <label>Include Rooms</label>
                <input
                  className="form-control"
                  value={includeRooms}
                  onChange={(e) => setIncludeRooms(e.target.value)}
                />
              </div>
            )}

            {roomSelection === "exclude" && (
              <div className="form-group">
                <label>Exclude Rooms</label>
                <input
                  className="form-control"
                  value={excludeRooms}
                  onChange={(e) => setExcludeRooms(e.target.value)}
                />
              </div>
            )}

            {/* Upload */}
            <div className="form-group">
              <label>Upload Datesheet</label>
              <input
                type="file"
                className="form-control"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
            </div>

            <button type="submit" className="btn-login">
              Submit
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}