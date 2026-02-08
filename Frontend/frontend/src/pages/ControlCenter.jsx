import React from "react";
import { useNavigate } from "react-router-dom";
import "./ControlCenter.css";

export default function ControlCenter() {
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  const handleGenerateClick = () => {
    navigate("/submit-details");
  };

  const handlePreviewRoomsClick = () => {
    navigate("/room-allocation");
  };

  const handlePreviousPlansClick = () => {
    navigate("/previous-plans");
  };

  // ✅ ONLY NEW LOGIC (NO UI CHANGE)
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Upload successful");
    } catch {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <header className="header">
        <img src="/nitjlogo.png" alt="NITJ Logo" />
      </header>

      <div className="nav-bar">
        <div className="nav-left">
          <img src="/seating planner logo.png" alt="Seating Planner Logo" />
          <span>| SEATING PLANNER - NITJ |</span>
        </div>

        <div className="nav-right">
          <a href="#contact">CONTACT US</a>
          <a href="#" onClick={handleLogout}>LOG OUT</a>
        </div>
      </div>

      <div className="stepper">
        <div className="step">
          <div className="circle">1</div>
          <div className="label">LOGIN</div>
        </div>
        <div className="arrow">→</div>
        <div className="step step-blue">
          <div className="circle">2</div>
          <div className="label">Choose Action</div>
        </div>
        <div className="arrow">→</div>
        <div className="step">
          <div className="circle">3</div>
          <div className="label">Submit Details & Documents</div>
        </div>
        <div className="arrow">→</div>
        <div className="step">
          <div className="circle">4</div>
          <div className="label">View & Download Seat Plan</div>
        </div>
      </div>

      <main className="control-center-main">
        <section className="options-card">
          <div className="options-header">
            <h2>Seating Plan Control Center</h2>
            <p>
              Welcome! From here you can generate a new seating arrangement,
              or view plans you've created in the past.
            </p>
          </div>

          <div className="options-list">
            <button className="option-item" onClick={handleGenerateClick}>
              <span className="option-icon">📝</span>
              <div className="option-content">
                <div className="option-title">Generate Seating Plan</div>
                <div className="option-desc">
                  Create a new arrangement for upcoming exams
                </div>
              </div>
            </button>

            <button className="option-item" onClick={handlePreviousPlansClick}>
              <span className="option-icon">📋</span>
              <div className="option-content">
                <div className="option-title">View Previous Plans</div>
                <div className="option-desc">
                  Access and manage previously generated seating arrangements
                </div>
              </div>
            </button>

            <button className="option-item" onClick={handlePreviewRoomsClick}>
              <span className="option-icon">🏢</span>
              <div className="option-content">
                <div className="option-title">Preview Rooms</div>
                <div className="option-desc">
                  View and manage room allocations and layouts
                </div>
              </div>
            </button>

            <button
              className="option-item"
              onClick={() => document.getElementById("excelUpload").click()}
            >
              <span className="option-icon">📤</span>
              <div className="option-content">
                <div className="option-title">Upload Student Data</div>
                <div className="option-desc">
                  Import the list of students for exams
                </div>
              </div>
            </button>
          </div>
        </section>
      </main>

      <input
        type="file"
        id="excelUpload"
        accept=".xlsx,.xls"
        hidden
        onChange={handleFileUpload}
      />
    </div>
  );
}