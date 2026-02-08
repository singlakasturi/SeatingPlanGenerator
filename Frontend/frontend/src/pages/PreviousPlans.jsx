import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PreviousPlans.css";

export default function PreviousPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/history", {
        credentials: "include",
      });
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      console.error("Failed to fetch plans:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPlan = async (index) => {
    try {
      const res = await fetch(`http://localhost:5000/api/history/${index}`, {
        credentials: "include",
      });
      const data = await res.json();

      // payload already has the complete allocation data
      navigate("/room-allocation", { state: data.payload });
    } catch (err) {
      alert("Failed to load plan");
    }
  };

  const handleDeletePlan = async (index) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await fetch(`http://localhost:5000/api/history/${index}`, {
        method: "DELETE",
        credentials: "include",
      });

      // Refresh plans list
      fetchPlans();
    } catch (err) {
      alert("Failed to delete plan");
    }
  };

  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  // Helper to get summary from payload
  const getSummary = (payload) => {
    if (!payload || !payload.results) return { dates: 0, totalRooms: 0, firstDate: "N/A", time: "N/A" };
    
    const dates = payload.results.length;
    const totalRooms = payload.results.reduce((sum, r) => sum + (r.response?.rooms?.length || 0), 0);
    const firstDate = payload.results[0]?.date || "N/A";
    const time = payload.results[0]?.response?.time || "N/A";

    return { dates, totalRooms, firstDate, time };
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
          <img src="/seating planner logo.png" alt="Seating Planner Logo" />
          <span>| SEATING PLANNER - NITJ |</span>
        </div>
        <div className="nav-right">
          <a href="#contact">CONTACT US</a>
          <a href="#" onClick={handleLogout}>
            LOG OUT
          </a>
        </div>
      </div>

      {/* STEPPER */}
      <div className="stepper">
        <div className="step">
          <div className="circle">1</div>LOGIN
        </div>
        <div className="arrow">→</div>
        <div className="step step-blue">
          <div className="circle">2</div>Choose Action
        </div>
        <div className="arrow">→</div>
        <div className="step">
          <div className="circle">3</div>Submit Details
        </div>
        <div className="arrow">→</div>
        <div className="step">
          <div className="circle">4</div>View Seat Plan
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="previous-plans-main">
        <div className="plans-container">
          <div className="plans-header">
            <h2>Previous Seating Plans</h2>
            <button className="back-btn" onClick={() => navigate("/control-center")}>
              ← Back to Control Center
            </button>
          </div>

          {loading ? (
            <div className="loading">Loading plans...</div>
          ) : plans.length === 0 ? (
            <div className="no-plans">
              <p>No previous plans found</p>
              <button onClick={() => navigate("/submit-details")}>
                Create New Plan
              </button>
            </div>
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => {
                const summary = getSummary(plan.payload);
                return (
                  <div key={plan.index} className="plan-card">
                    <div className="plan-card-header">
                      <span className="plan-index">Plan #{plan.index + 1}</span>
                      <span className="plan-timestamp">{plan.timestamp}</span>
                    </div>

                    <div className="plan-card-body">
                      <div className="plan-info">
                        <strong>First Date:</strong> {summary.firstDate}
                      </div>
                      <div className="plan-info">
                        <strong>Time:</strong> {summary.time}
                      </div>
                      <div className="plan-info">
                        <strong>Total Dates:</strong> {summary.dates}
                      </div>
                      <div className="plan-info">
                        <strong>Total Rooms:</strong> {summary.totalRooms}
                      </div>
                    </div>

                    <div className="plan-card-actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewPlan(plan.index)}
                      >
                        View Plan
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeletePlan(plan.index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}