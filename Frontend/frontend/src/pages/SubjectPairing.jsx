import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SubjectPairing.css";

export default function SubjectPairing() {
  const navigate = useNavigate();

  const payload = useMemo(() => {
    try {
      const cached = sessionStorage.getItem("allocationPayload");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }, []);

  const allocationRequest = useMemo(() => {
    try {
      const cached = sessionStorage.getItem("allocationRequest");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }, []);

  const [dateData, setDateData] = useState([]);
  const [dateIndex, setDateIndex] = useState(0);

  /* ================= LOAD SUBJECTS ================= */

  useEffect(() => {
    if (!payload?.results?.length) return;

    const built = payload.results.map(result => {
      const subjects = getSubjectsForDate(result, allocationRequest);
      const pairs = buildPairs(subjects);

      return {
        date: result.date,
        time: result.response?.time || "",
        subjects,
        pairs
      };
    });

    setDateData(built);
    setDateIndex(0);
  }, [payload, allocationRequest]);

  /* ================= SWAP LOGIC ================= */

  const swapSubjects = (pairIndex, side, newCode) => {
    setDateData(prev =>
      prev.map((item, idx) => {
        if (idx !== dateIndex) return item;

        const updatedPairs = item.pairs.map(p => ({
          left: { ...p.left },
          right: { ...p.right }
        }));

        const current = updatedPairs[pairIndex]?.[side];
        if (!current || current.code === newCode) return item;

        let fromPair = -1;
        let fromSide = "";

        updatedPairs.forEach((p, i) => {
          if (p.left.code === newCode) {
            fromPair = i;
            fromSide = "left";
          } else if (p.right.code === newCode) {
            fromPair = i;
            fromSide = "right";
          }
        });

        if (fromPair === -1) return item;

        const temp = updatedPairs[pairIndex][side];
        updatedPairs[pairIndex][side] = updatedPairs[fromPair][fromSide];
        updatedPairs[fromPair][fromSide] = temp;

        return { ...item, pairs: updatedPairs };
      })
    );
  };

  /* ================= SAVE + RETURN ================= */

  const saveAndReturn = () => {
    const updatedPayload = (() => {
      try {
        const cached = sessionStorage.getItem("allocationPayload");
        return cached ? JSON.parse(cached) : null;
      } catch {
        return null;
      }
    })();

    if (!updatedPayload?.results?.length) return;

    const pairingLookup = new Map(
      dateData.map(item => {
        const map = new Map();
        item.pairs.forEach(pair => {
          const pairList = [pair.left.code, pair.right.code];
          map.set(pair.left.code, pairList);
          map.set(pair.right.code, pairList);
        });
        return [item.date, map];
      })
    );

    const updatedResults = updatedPayload.results.map(result => {
      const map = pairingLookup.get(result.date);
      if (!map) return result;

      const rooms = (result.response?.rooms || []).map(room => {
        const pair = (room.subjectPair || []).find(code => map.has(code));
        if (!pair) return room;
        return { ...room, subjectPair: map.get(pair) };
      });

      return {
        ...result,
        response: {
          ...result.response,
          rooms
        }
      };
    });

    updatedPayload.results = updatedResults;
    sessionStorage.setItem("allocationPayload", JSON.stringify(updatedPayload));
    navigate("/room-allocation");
  };

  /* ================= RENDER ================= */

  if (!dateData.length) {
    return (
      <div className="subject-pairing">
        <header className="header">
          <img src="/nitjlogo.png" alt="NITJ Logo" />
        </header>

        <div className="nav-bar">
          <div className="nav-left">
            <img src="/seating planner logo.png" alt="" />
            <span>| SEATING PLANNER - NITJ |</span>
          </div>
        </div>

        <main>
          <div className="room-container">
            <h2 className="room-title">Subject Pairing</h2>
            <p style={{ textAlign: "center" }}>
              No pairing data found. Please submit details first.
            </p>
          </div>
        </main>
      </div>
    );
  }

  const current = dateData[dateIndex];

  return (
    <div className="subject-pairing">
      <header className="header">
        <img src="/nitjlogo.png" alt="NITJ Logo" />
      </header>

      <div className="nav-bar">
        <div className="nav-left">
          <img src="/seating planner logo.png" alt="" />
          <span>| SEATING PLANNER - NITJ |</span>
        </div>
      </div>

      <main>
        <div className="room-container">
          <h2 className="room-title">Subject Pairing</h2>

          <div className="exam-info">
            <button
              onClick={() => setDateIndex(i => Math.max(i - 1, 0))}
              disabled={dateIndex === 0}
            >
              &lt; Prev
            </button>

            <div className="date-control">
              <label htmlFor="dateSelect">Date</label>
              <select
                id="dateSelect"
                className="date-select"
                value={dateIndex}
                onChange={e => setDateIndex(Number(e.target.value))}
              >
                {dateData.map((item, idx) => (
                  <option key={item.date} value={idx}>
                    {item.date}
                  </option>
                ))}
              </select>
              {current.time ? (
                <span className="date-time">Time: {current.time}</span>
              ) : null}
            </div>

            <span className="date-meta">
              ({dateIndex + 1} of {dateData.length})
            </span>

            <button
              onClick={() => setDateIndex(i => Math.min(i + 1, dateData.length - 1))}
              disabled={dateIndex === dateData.length - 1}
            >
              Next &gt;
            </button>
          </div>

          <table className="room-table">
            <thead>
              <tr>
                <th>Subject A</th>
                <th>Subject B</th>
              </tr>
            </thead>

            <tbody>
              {current.pairs.map((pair, idx) => (
                <tr key={idx}>
                  <td>
                    <select
                      value={pair.left.code}
                      onChange={e => swapSubjects(idx, "left", e.target.value)}
                    >
                      {current.subjects.map(s => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      value={pair.right.code}
                      onChange={e => swapSubjects(idx, "right", e.target.value)}
                    >
                      {current.subjects.map(s => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="room-actions">
            <button className="action-btn blue" onClick={saveAndReturn}>
              Save Pairing & Return
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

const normalizeSubjects = (list = []) => {
  const seen = new Set();
  const output = [];

  list.forEach(subject => {
    if (!subject || seen.has(subject)) return;
    seen.add(subject);
    output.push({ code: subject, name: subject });
  });

  return output;
};

const getSubjectsForDate = (result, allocationRequest) => {
  const fromRequest = allocationRequest?.datesheet?.[result.date];
  if (Array.isArray(fromRequest) && fromRequest.length) {
    return normalizeSubjects(fromRequest);
  }

  const subjects = [];
  (result.response?.rooms || []).forEach(room => {
    (room.subjectPair || []).forEach(subject => subjects.push(subject));
  });

  return normalizeSubjects(subjects);
};

const buildPairs = (subjects) => {
  const pairs = [];
  for (let i = 0; i < subjects.length; i += 2) {
    if (!subjects[i + 1]) break;
    pairs.push({ left: subjects[i], right: subjects[i + 1] });
  }
  return pairs;
};
