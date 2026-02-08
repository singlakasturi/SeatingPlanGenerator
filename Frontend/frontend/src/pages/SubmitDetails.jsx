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

  /* ================= DATE SHEET ================= */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const workbook = XLSX.read(evt.target.result, { type: "binary" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        range: 6,
        defval: "",
      });

      const parsed = {};
      for (const row of rows.slice(1)) {
        if (!row[0]) break;

        let date;
        if (typeof row[0] === "number") {
          const d = XLSX.SSF.parse_date_code(row[0]);
          date = `${d.y}-${String(d.m).padStart(2, "0")}-${String(d.d).padStart(2, "0")}`;
        } else {
          date = row[0];
        }

        const subjects = [];
        for (let i = 1; i < row.length; i++) {
          if (row[i]) subjects.push(row[i].toString().split(/\s|\n/)[0]);
        }

        if (subjects.length) {
          parsed[date] = [...new Set(subjects)];
        }
      }

      setDatesheet(parsed);
    };

    reader.readAsBinaryString(file);
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!datesheet) {
      alert("Please upload datesheet");
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

    try {
      // 🔑 Store request for later reallocation
      sessionStorage.setItem("allocationRequest", JSON.stringify(payload));

      const res = await axios.post(
        "http://localhost:5000/allocate",
        payload,
        { withCredentials: true }
      );

      // 🔑 Store allocation result
      sessionStorage.setItem("allocationPayload", JSON.stringify(res.data));
      sessionStorage.setItem("hasAllocated", "true");

      navigate("/room-allocation", { state: res.data });
    } catch (err) {
      alert(
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
          <a href="#" onClick={handleLogout}>
            LOG OUT
          </a>
        </div>
      </div>

      {/* MAIN */}
      <main className="submit-container">
        <section className="submit-card">
          <h2>PROVIDE EXAM DETAILS</h2>

          <form onSubmit={handleSubmit}>
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

            <div className="form-group">
              <label>Upload Datesheet</label>
              <input
                type="file"
                className="form-control"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
              />
            </div>

            <button className="btn-login">Submit</button>
          </form>
        </section>
      </main>
    </div>
  );
}
