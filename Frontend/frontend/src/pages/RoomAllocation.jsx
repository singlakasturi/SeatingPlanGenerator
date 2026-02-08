// import React, { useMemo, useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
// import "./RoomAllocation.css";

// export default function RoomAllocation() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   /* ================= LOAD DATA ================= */
//   const raw = useMemo(() => {
//     if (location.state) return location.state;
//     try {
//       const cached = sessionStorage.getItem("allocationPayload");
//       return cached ? JSON.parse(cached) : null;
//     } catch {
//       return null;
//     }
//   }, [location.state]);

//   /* ================= NORMALIZE ================= */
//   const [items, setItems] = useState([]);

//   useEffect(() => {
//     if (!raw) return;

//     if (Array.isArray(raw.results)) {
//       setItems(
//         raw.results.map((r) => ({
//           date: r.date,
//           time: r.response?.time || "",
//           rooms: r.response?.rooms || [],
//         }))
//       );
//     }
//   }, [raw]);

//   /* ================= UPDATE ROOM (FROM EDIT) ================= */
//   const updateRoom = (date, updatedRoom) => {
//     setItems((prev) => {
//       const updated = prev.map((item) =>
//         item.date === date
//           ? {
//             ...item,
//             rooms: item.rooms.map((r) =>
//               r.roomCode === updatedRoom.roomCode ? updatedRoom : r
//             ),
//           }
//           : item
//       );

//       // Also update sessionStorage so changes persist
//       const updatedPayload = {
//         ...raw,
//         results: updated.map(item => ({
//           date: item.date,
//           response: {
//             time: item.time,
//             rooms: item.rooms
//           }
//         }))
//       };
//       sessionStorage.setItem("allocationPayload", JSON.stringify(updatedPayload));

//       return updated;
//     });
//   };

//   const [index, setIndex] = useState(0);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => setIndex(0), [items.length]);

//   if (!items.length) {
//     return <h2>No allocation data found! Submit exam details first.</h2>;
//   }

//   const { date, time, rooms } = items[index];

//   /* ================= LOGOUT ================= */
//   const handleLogout = (e) => {
//     e.preventDefault();
//     if (window.confirm("Are you sure you want to log out?")) {
//       navigate("/");
//     }
//   };

//   /* ================= PREVIEW ROOM ================= */
//   const handlePreviewRoom = (roomData) => {
//     navigate("/preview-room", {
//       state: {
//         roomData,
//         examData: { date, time },
//         // Don't pass the function - we'll handle updates differently
//       },
//     });
//   };

//   /* ================= NAVIGATION ================= */
//   const canPrev = index > 0;
//   const canNext = index < items.length - 1;

//   const prev = () => canPrev && setIndex((i) => i - 1);
//   const next = () => canNext && setIndex((i) => i + 1);

//   /* ================= REGENERATE ================= */
//   const handleRegenerate = async () => {
//     const cachedReq = sessionStorage.getItem("allocationRequest");
//     if (!cachedReq) {
//       alert("Original allocation details not found.");
//       navigate("/submit-details");
//       return;
//     }

//     try {
//       setLoading(true);
//       const reqBody = JSON.parse(cachedReq);
//       const res = await axios.post(
//         "http://localhost:5000/allocate",
//         reqBody,
//         { withCredentials: true }
//       );

//       sessionStorage.setItem("allocationPayload", JSON.stringify(res.data));
//       navigate("/room-allocation", { state: res.data });
//     } catch {
//       alert("Regeneration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ================= DOWNLOAD ZIP ================= */
//   const downloadPdfZip = async () => {
//     const res = await fetch("http://localhost:5000/api/download/pdf", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(raw),
//     });

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "room_pdfs.zip";
//     a.click();
//   };

//   const downloadExcelZip = async () => {
//     const res = await fetch("http://localhost:5000/api/download/excel", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(raw),
//     });

//     const blob = await res.blob();
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "room_excels.zip";
//     a.click();
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div>
//       {/* HEADER */}
//       <header className="header">
//         <img src="/nitjlogo.png" alt="NITJ Logo" />
//       </header>

//       {/* NAVBAR */}
//       <div className="nav-bar">
//         <div className="nav-left">
//           <img src="/seating planner logo.png" alt="Seating Planner Logo" />
//           <span>| SEATING PLANNER - NITJ |</span>
//         </div>
//         <div className="nav-right">
//           <a href="#contact">CONTACT US</a>
//           <a href="#" onClick={handleLogout}>
//             LOG OUT
//           </a>
//         </div>
//       </div>

//       {/* STEPPER */}
//       <div className="stepper">
//         <div className="step">
//           <div className="circle">1</div>LOGIN
//         </div>
//         <div className="arrow">→</div>
//         <div className="step">
//           <div className="circle">2</div>Choose Action
//         </div>
//         <div className="arrow">→</div>
//         <div className="step">
//           <div className="circle">3</div>Submit Details
//         </div>
//         <div className="arrow">→</div>
//         <div className="step step-blue">
//           <div className="circle">4</div>View Seat Plan
//         </div>
//       </div>

//       {/* MAIN */}
//       <main>
//         <div className="room-container">
//           <h2 className="room-title">Room Subject Allocation</h2>

//           <div className="exam-info">
//             <button onClick={prev} disabled={!canPrev} className="preview-btn">
//               &lt; Prev
//             </button>

//             <span>
//               <strong>Date:</strong> {date} | <strong>Time:</strong> {time}
//             </span>

//             <span style={{ fontSize: "14px", margin: "0px 10px 0px 10px", opacity: 0.8 }}>
//               ({index + 1} of {items.length})
//             </span>

//             <button onClick={next} disabled={!canNext} className="preview-btn">
//               Next &gt;
//             </button>
//           </div>

//           <table className="room-table">
//             <thead>
//               <tr>
//                 <th>ROOM NO.</th>
//                 <th>SUBJECT CODE(S)</th>
//                 <th>TOTAL SEATS</th>
//                 <th>ACTION</th>
//               </tr>
//             </thead>
//             <tbody>
//               {rooms.length ? (
//                 rooms.map((room, i) => (
//                   <tr key={room.roomCode || i}>
//                     <td>{room.roomCode}</td>
//                     <td>{room.subjectPair?.join(", ")}</td>
//                     <td>{room.allocations.length}</td>
//                     <td>
//                       <button
//                         className="preview-btn"
//                         onClick={() => handlePreviewRoom(room)}
//                       >
//                         Preview Room
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="4">No rooms allocated</td>
//                 </tr>
//               )}
//             </tbody>
//           </table>

//           <div className="room-actions">
//             <button
//               className="action-btn white"
//               onClick={handleRegenerate}
//               disabled={loading}
//             >
//               {loading ? "Regenerating..." : "Regenerate"}
//             </button>
//             <button
//               className="action-btn white"
//               onClick={() => navigate("/subject-pairing")}
//             >
//                 Edit Subject Pairs
//             </button>
//             <button className="action-btn blue" onClick={downloadPdfZip}>
//               Download PDF
//             </button>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./RoomAllocation.css";

export default function RoomAllocation() {
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= LOAD DATA ================= */
  const raw = useMemo(() => {
    if (location.state) return location.state;
    try {
      const cached = sessionStorage.getItem("allocationPayload");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }, [location.state]);

  /* ================= NORMALIZE ================= */
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!raw) return;

    if (Array.isArray(raw.results)) {
      setItems(
        raw.results.map((r) => ({
          date: r.date,
          time: r.response?.time || "",
          rooms: r.response?.rooms || [],
        }))
      );
    }
  }, [raw]);

  /* ================= UPDATE ROOM (FROM EDIT) ================= */
  const updateRoom = (date, updatedRoom) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.date === date
          ? {
            ...item,
            rooms: item.rooms.map((r) =>
              r.roomCode === updatedRoom.roomCode ? updatedRoom : r
            ),
          }
          : item
      );

      // Also update sessionStorage so changes persist
      const updatedPayload = {
        ...raw,
        results: updated.map(item => ({
          date: item.date,
          response: {
            time: item.time,
            rooms: item.rooms
          }
        }))
      };
      sessionStorage.setItem("allocationPayload", JSON.stringify(updatedPayload));

      return updated;
    });
  };

  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => setIndex(0), [items.length]);

  if (!items.length) {
    return <h2>No allocation data found! Submit exam details first.</h2>;
  }

  const { date, time, rooms } = items[index];

  /* ================= LOGOUT ================= */
  const handleLogout = (e) => {
    e.preventDefault();
    if (window.confirm("Are you sure you want to log out?")) {
      navigate("/");
    }
  };

  /* ================= PREVIEW ROOM ================= */
  const handlePreviewRoom = (roomData) => {
    navigate("/preview-room", {
      state: {
        roomData,
        examData: { date, time },
        // Don't pass the function - we'll handle updates differently
      },
    });
  };

  /* ================= NAVIGATION ================= */
  const canPrev = index > 0;
  const canNext = index < items.length - 1;

  const prev = () => canPrev && setIndex((i) => i - 1);
  const next = () => canNext && setIndex((i) => i + 1);

  /* ================= REGENERATE ================= */
  const handleRegenerate = async () => {
    const cachedReq = sessionStorage.getItem("allocationRequest");
    if (!cachedReq) {
      alert("Original allocation details not found.");
      navigate("/submit-details");
      return;
    }

    try {
      setLoading(true);
      const reqBody = JSON.parse(cachedReq);
      const res = await axios.post(
        "http://localhost:5000/allocate",
        reqBody,
        { withCredentials: true }
      );

      sessionStorage.setItem("allocationPayload", JSON.stringify(res.data));
      navigate("/room-allocation", { state: res.data });
    } catch {
      alert("Regeneration failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DOWNLOAD ZIP ================= */
  const downloadPdfZip = async () => {
    const res = await fetch("http://localhost:5000/api/download/pdf", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(raw),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "room_pdfs.zip";
    a.click();
  };

  const downloadExcelZip = async () => {
    const res = await fetch("http://localhost:5000/api/download/excel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(raw),
    });

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "room_excels.zip";
    a.click();
  };

  /* ================= RENDER ================= */
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
        <div className="step">
          <div className="circle">2</div>Choose Action
        </div>
        <div className="arrow">→</div>
        <div className="step">
          <div className="circle">3</div>Submit Details
        </div>
        <div className="arrow">→</div>
        <div className="step step-blue">
          <div className="circle">4</div>View Seat Plan
        </div>
      </div>

      {/* MAIN */}
      <main>
        <div className="room-container">
          <h2 className="room-title">Room Subject Allocation</h2>

          <div className="exam-info">
            <button onClick={prev} disabled={!canPrev} className="preview-btn">
              &lt; Prev
            </button>

            <span>
              <strong>Date:</strong> {date} | <strong>Time:</strong> {time}
            </span>

            <span style={{ fontSize: "14px", margin: "0px 10px 0px 10px", opacity: 0.8 }}>
              ({index + 1} of {items.length})
            </span>

            <button onClick={next} disabled={!canNext} className="preview-btn">
              Next &gt;
            </button>
          </div>

          <table className="room-table">
            <thead>
              <tr>
                <th>ROOM NO.</th>
                <th>SUBJECT CODE(S)</th>
                <th>TOTAL SEATS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {rooms.length ? (
                rooms.map((room, i) => (
                  <tr key={room.roomCode || i}>
                    <td>{room.roomCode}</td>
                    <td>{room.subjectPair?.join(", ")}</td>
                    <td>{room.allocations.length}</td>
                    <td>
                      <button
                        className="preview-btn"
                        onClick={() => handlePreviewRoom(room)}
                      >
                        Preview Room
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No rooms allocated</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="room-actions">
            <button
              className="action-btn white"
              onClick={handleRegenerate}
              disabled={loading}
            >
              {loading ? "Regenerating..." : "Regenerate"}
            </button>
            <button
              className="action-btn white"
              onClick={() => navigate("/subject-pairing")}
            >
                Edit Subject Pairs
            </button>
            <button
              className="action-btn white"
              onClick={() => navigate("/previous-plans")}
            >
              View Previous Plans
            </button>
            <button className="action-btn blue" onClick={downloadPdfZip}>
              Download PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}