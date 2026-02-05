// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import "./PreviewRoom.css";

// const MOCK_ALT_DATA = {
//   roomCode: "ALT-1",
//   type: "ALT",
//   capacity: 90,
//   subjectPair: ["CS_301", "ME_301"],
//   allocations: []
// };

// const sectionConfig = { L: 11, C: 10, R: 9 };
// const sections = ["L", "C", "R"];

// sections.forEach(side => {
//   const rowLimit = sectionConfig[side];
//   for (let r = 1; r <= rowLimit; r++) {
//     for (let c = 1; c <= 3; c++) {
//       if (c === 2) continue; 

//       if (Math.random() > 0.2) { 
//         MOCK_ALT_DATA.allocations.push({
//           seatId: `${side}${r}-${c}`,
//           rollNo: `210${Math.floor(1000 + Math.random() * 9000)}`,
//           subjectCode: (r + c) % 2 === 0 ? "CS_301" : "ME_301"
//         });
//       }
//     }
//   }
// });

// const PreviewRoom = () => {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { roomData, examData, onUpdate } = location.state || {};

//   const safeExamData = examData || { date: new Date().toISOString() };

//   const [cellNotes, setCellNotes] = useState({});


//  useEffect(() => {
//   if (!roomData?.allocations) return;

//   const notes = {};
//   roomData.allocations.forEach(a => {
//     if (a.note) notes[a.seatId] = a.note;
//   });
//   setCellNotes(notes);
// }, [roomData]);


  
//   const submitted = (() => {
//     try {
//       const raw = localStorage.getItem("submitDetails");
//       return raw ? JSON.parse(raw) : null;
//     } catch {
//       return null;
//     }
//   })();

//   if (!roomData) {
//     return (
//       <div className="preview-root">
//         <div className="main">
//           <p>No room data available</p>
//           <button onClick={() => navigate("/room-allocation")}>
//             Back to Room Allocation
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const parseSeatId = (seatId) => {
//     const match = seatId.match(/([LCR])(\d+)-(\d+)/);
//     if (match) {
//       return {
//         side: match[1],
//         row: parseInt(match[2]),
//         column: parseInt(match[3]),
//       };
//     }
//     return null;
//   };

//   const getLayoutDimensions = () => {
//     let maxColumn = 0;
//     let maxRow = 0;
//     roomData.allocations.forEach((allocation) => {
//       const parsed = parseSeatId(allocation.seatId);
//       if (parsed) {
//         maxColumn = Math.max(maxColumn, parsed.column);
//         maxRow = Math.max(maxRow, parsed.row);
//       }
//     });
//     return { columns: maxColumn, rows: maxRow };
//   };

//   const { columns, rows: rowsCount } = getLayoutDimensions();

//   const subjectTags = (roomData?.subjectPair || []).map((s) => {
//     const m = String(s).match(/[A-Za-z]+/);
//     return m ? m[0].toUpperCase() : String(s).toUpperCase();
//   });

//   const seatMap = {};
//   roomData.allocations.forEach((allocation) => {
//     seatMap[allocation.seatId] = allocation;
//   });

//   const transformToGridData = () => {
//     const leftHeaders = [];
//     const rightHeaders = [];
//     const leftRows = [];
//     const rightRows = [];

//     for (let c = 1; c <= columns; c++) {
//       const subjectTag = subjectTags[(c - 1) % subjectTags.length];
//       leftHeaders.push({ col: c, subject: subjectTag });
//       rightHeaders.push({ col: c, subject: subjectTag });
//     }

//     for (let r = 1; r <= rowsCount; r++) {
//       const leftRow = [];
//       const rightRow = [];
//       for (let c = 1; c <= columns; c++) {
//         const leftSeatId = `L${r}-${c}`;
//         const rightSeatId = `R${r}-${c}`;
//         leftRow.push(seatMap[leftSeatId] ? { ...seatMap[leftSeatId], subjectShort: String(seatMap[leftSeatId].subjectCode).split("_")[0] } : null);
//         rightRow.push(seatMap[rightSeatId] ? { ...seatMap[rightSeatId], subjectShort: String(seatMap[rightSeatId].subjectCode).split("_")[0] } : null);
//       }
//       leftRows.push(leftRow);
//       rightRows.push(rightRow);
//     }
//     return { leftSide: { headers: leftHeaders, rows: leftRows }, rightSide: { headers: rightHeaders, rows: rightRows } };
//   };

//   const gridData = transformToGridData();

//   const handleBack = () => {
//     navigate("/room-allocation");
//   };

//   const handleEdit = () => {
//   navigate("/edit-room", {
//     state: {
//       roomData,
//       examData,
//       onUpdate   // 🔥 pass updater
//     }
//   });
// };


//   const formatRoll = (roll) => {
//     if (!roll) return "";
//     const s = String(roll).replace(/\s+/g, "");
//     const m = s.match(/(\d+)$/);
//     return m ? m[0] : s;
//   };

//   const subjectCounts = roomData.subjectPair.reduce((acc, subj) => {
//     acc[subj] = 0;
//     return acc;
//   }, {});
//   roomData.allocations.forEach((a) => {
//     if (subjectCounts[a.subjectCode] !== undefined) subjectCounts[a.subjectCode] += 1;
//   });
//   const totalSeats = Object.values(subjectCounts).reduce((s, n) => s + n, 0);
  
//   const totalsText = subjectTags
//     .map((tag, idx) => {
//       const code = roomData.subjectPair[idx];
//       const count = subjectCounts[code] || 0;
//       return `${tag}-${count}`;
//     })
//     .join(" & ") + `, TOTAL = ${totalSeats}`;

//  const planDateText = safeExamData?.date
//   ? new Date(safeExamData.date).toLocaleString(undefined, { month: "long", year: "numeric" })
//   : "December 2025";


//   const displayData = {
//     university: "DR BR Ambedkar National Institute of Technology, Jalandhar",
//     examination: "EXAMINATION SECTION",
//     planName: `Seating Plan End Semester Examinations ${planDateText}`,
//     roomNo: roomData.roomCode,
//     batch: submitted?.programme && submitted?.year
//         ? `${submitted.programme.toUpperCase()} ${submitted.year} Semester (${submitted.batch || "2024 Batch"})`
//         : "B Tech III Semester (2024 Batch)",
//     totals: totalsText,
//     leftSide: gridData.leftSide,
//     rightSide: gridData.rightSide,
//   };

//   const styles = `
//     .preview-root {
//       background-color: #f1f5f9;
//       min-height: 100vh;
//       display: flex;
//       flex-direction: column;
//       font-family: 'Inter', sans-serif;
//     }
//     .header { background-color: #0f172a; padding: 1rem 2rem; display: flex; align-items: center; color: white; }
//     .logo { height: 50px; }
//     .main { flex: 1; padding: 2rem; display: flex; justify-content: center; position: relative; }
    
//     .preview-card {
//       background: white;
//       border-radius: 12px;
//       box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
//       width: 100%;
//       max-width: 95vw; 
//       padding: 2rem;
//       display: flex;
//       flex-direction: column;
//       position: relative;
//     }
    
//     .edit-button-fixed {
//       position: fixed;
//       bottom: 30px;
//       right: 30px;
//       padding: 14px 28px;
//       background: #2563eb;
//       color: white;
//       border: none;
//       border-radius: 12px;
//       font-size: 15px;
//       font-weight: 700;
//       cursor: pointer;
//       box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
//       transition: all 0.3s ease;
//       z-index: 1000;
//     }
    
//     .edit-button-fixed:hover {
//       background: #1d4ed8;
//       transform: translateY(-3px);
//       box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4);
//     }
    
//     .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
//     .back-btn { background: none; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; color: #64748b; }
//     .card-title { text-align: center; flex: 1; }
//     .card-title h1 { font-size: 1.5rem; color: #0f172a; margin: 0.25rem 0; font-weight: 700; }
//     .card-subtitle { font-size: 0.875rem; color: #64748b; font-weight: 500; text-transform: uppercase; }
//     .card-plan { font-size: 0.9rem; color: #475569; }
    
//     .room-meta { text-align: center; padding: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2rem; }
//     .room-meta p { font-weight: 600; color: #334155; }
    
//     .blackboard-bar { background: #0f172a; color: white; text-align: center; padding: 0.75rem; border-radius: 8px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 2rem; }

//     .lt-wall, .alt-wall {
//       text-align: center;
//       background-color: #f1f5f9;
//       border: 1px solid #cbd5e1;
//       padding: 0.5rem;
//       font-weight: 700;
//       color: #475569;
//       letter-spacing: 2px;
//       text-transform: uppercase;
//       font-size: 0.8rem;
//       margin-bottom: 1rem;
//     }
//     .lt-wall.bottom, .alt-wall.bottom { margin-top: 1rem; margin-bottom: 1rem; }
    
//     .lt-layout { width: 100%; display: flex; flex-direction: column; }
//     .lt-sections { display: flex; justify-content: center; gap: 1.5rem; }
    
//     .lt-side { flex: 1; display: flex; flex-direction: column; align-items: center; }
//     .lt-side-title { width: 100%; text-align: center; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; color: #334155; }
    
//     .lt-aisle {
//       width: 40px;
//       display: flex;
//       align-items: center;
//       justify-content: center;
//       writing-mode: vertical-rl;
//       text-orientation: mixed;
//       background-color: #f1f5f9;
//       border: 1px solid #e2e8f0;
//       color: #64748b;
//       font-weight: 700;
//       font-size: 0.8rem;
//       letter-spacing: 3px;
//       border-radius: 20px;
//       margin-top: 2rem;
//     }

//     .lt-table {
//       width: 100%;
//       border-collapse: collapse;
//       table-layout: fixed;
//     }
    
//     .lt-table th {
//       border: 1px solid #94a3b8;
//       text-align: center;
//       padding: 4px;
//       overflow: hidden;
//     }
//     .header-num {
//       background-color: #f1f5f9;
//       color: #64748b;
//       font-size: 0.75rem;
//     }
//     .header-subj {
//       background-color: #fff;
//       color: #1e293b;
//       font-size: 0.75rem;
//       font-weight: 800;
//       white-space: nowrap;
//       text-overflow: ellipsis;
//       overflow: hidden;
//     }
    
//     .lt-table td {
//       border: 1px solid #94a3b8;
//       text-align: center;
//       padding: 2px;
//       font-size: 11px;
//       font-family: monospace;
//       font-weight: 500;
//       color: #334155;
//       min-width: 55px;
//       vertical-align: top;
//     }
    
//     .cell-content-wrapper {
//       display: flex;
//       flex-direction: column;
//       align-items: center;
//       gap: 2px;
//     }
    
//     .cell-roll {
//       font-size: 11px;
//       font-family: monospace;
//       font-weight: 500;
//     }
    
//     .cell-note {
//       font-size: 9px;
//       color: #dc2626;
//       font-weight: 600;
//       font-style: italic;
//       text-transform: uppercase;
//     }
    
//     .seat-vacant { background-color: #f8fafc; color: #cbd5e1; font-style: italic; font-weight: 400; }
//     .seat-filled { background-color: #fff; }

//     .lt-totals { text-align: center; font-weight: 700; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc; color: #334155; }

//     .alt-layout { display: flex; flex-direction: column; gap: 1rem; }
//     .alt-sections { display: flex; justify-content: center; gap: 0.5rem; }
//     .alt-section { flex: 1; min-width: 0; }
//     .alt-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
//     .alt-table th, .alt-table td { border: 1px solid #cbd5e1; padding: 4px; text-align: center; vertical-align: top; }
//     .alt-aisle { width: 30px; writing-mode: vertical-rl; background: #eef2f6; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: #64748b; }

//     .seating-wrapper { display: flex; justify-content: center; gap: 1rem; }
//     .wall-block { writing-mode: vertical-rl; background: #eef2f6; padding: 1rem 0.5rem; display: flex; align-items: center; border: 1px solid #cbd5e1; }
//     .aisle-block { writing-mode: vertical-rl; background: #f1f5f9; padding: 1rem 0.5rem; display: flex; align-items: center; border: 1px dashed #cbd5e1; }
//     .grid-container { display: grid; gap: 2px; background: #e2e8f0; padding: 2px; }
//     .desk-cell { background: white; padding: 4px; min-width: 70px; height: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.75rem; gap: 2px; }
    
//     @media print {
//       .preview-root { background: white; padding: 0; }
//       .header, .back-btn, .edit-button-fixed { display: none; }
//       .preview-card { box-shadow: none; border: none; padding: 0; max-width: none; }
//       .blackboard-bar { border: 1px solid #000; background: #ddd; color: black; }
//     }
//   `;

//   const renderLTLayout = () => {
//     const subjectSeq = (roomData?.subjectPair || [])
//       .map((s) => String(s).split("_")[0].toUpperCase())
//       .filter(Boolean);
    
//     const buildSideMatrix = (sideLetter) => {
//       const matrix = [];
//       for (let r = 1; r <= rowsCount; r++) {
//         const row = [];
//         for (let c = 1; c <= columns; c++) {
//           const seatId = `${sideLetter}${r}-${c}`;
//           const alloc = seatMap[seatId];
//           row.push(alloc ? alloc.rollNo : "");
//         }
//         matrix.push(row);
//       }
//       return matrix;
//     };
    
//     const leftMatrix = buildSideMatrix("L");
//     const rightMatrix = buildSideMatrix("R");

//     const colVacant = Array.from({ length: columns }, (_, idx) => {
//       const leftEmpty = leftMatrix.every((row) => !row[idx]);
//       const rightEmpty = rightMatrix.every((row) => !row[idx]);
//       return leftEmpty && rightEmpty;
//     });

//     const getColumnSubject = (colIndex, side) => {
//       const seq = subjectSeq.length ? subjectSeq : ["SUBJ"];
      
//       if (colVacant[colIndex]) return "Vacant";
      
//       let activeIdx = 0;
//       for(let i=0; i<columns; i++) {
//          if(!colVacant[i]) {
//             if(side === 'L' && i === colIndex) return seq[activeIdx % seq.length];
//             activeIdx++;
//          }
//       }
//       for(let i=0; i<columns; i++) {
//          if(!colVacant[i]) {
//             if(side === 'R' && i === colIndex) return seq[activeIdx % seq.length];
//             activeIdx++;
//          }
//       }
//       return "Vacant";
//     };

//     const renderBlock = (title, matrix, side) => (
//       <div className="lt-side">
//         <div className="lt-side-title">{title}</div>
//         <table className="lt-table">
//           <thead>
//             <tr>
//               {Array.from({ length: columns }).map((_, i) => (
//                 <th key={`n-${i}`} className="header-num">{i + 1}</th>
//               ))}
//             </tr>
//             <tr>
//               {Array.from({ length: columns }).map((_, i) => {
//                 const subj = getColumnSubject(i, side);
//                 const isVacant = colVacant[i];
//                 return (
//                   <th key={`s-${i}`} className={`header-subj ${isVacant ? 'text-gray-400 font-normal' : ''}`}>
//                     {subj}
//                   </th>
//                 );
//               })}
//             </tr>
//           </thead>
//           <tbody>
//             {matrix.map((row, rIdx) => (
//               <tr key={rIdx}>
//                 {row.map((roll, cIdx) => {
//                   const isVacantCol = colVacant[cIdx];
//                   const content = roll || (isVacantCol ? "Vacant" : "");
//                   const seatId = `${side}${rIdx + 1}-${cIdx + 1}`;
//                   const note = cellNotes[seatId] || "";
                  
//                   return (
//                     <td key={cIdx} className={content && !isVacantCol ? "seat-filled" : "seat-vacant"}>
//                       {content === "Vacant" ? (
//                         "Vacant"
//                       ) : content ? (
//                         <div className="cell-content-wrapper">
//                           <div className="cell-roll">{formatRoll(content)}</div>
//                           {note && <div className="cell-note">{note}</div>}
//                         </div>
//                       ) : null}
//                     </td>
//                   );
//                 })}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );

//     return (
//       <div className="lt-layout">
//         <div className="lt-wall">WALL</div>
//         <div className="lt-sections">
//           {renderBlock("Left Side Columns", leftMatrix, "L")}
          
//           <div className="lt-aisle">
//             <span>AISLE</span>
//           </div>
          
//           {renderBlock("Right Side Columns", rightMatrix, "R")}
//         </div>
//         <div className="lt-wall bottom">WALL</div>
//         <div className="lt-totals">{displayData.totals}</div>
//       </div>
//     );
//   };

//   const renderALTLayout = () => {
//     const sectionOrder = [
//       { key: "L", label: "Left Side", defaultCols: 3, fixedRows: 11 },
//       { key: "C", label: "Centre", defaultCols: 3, fixedRows: 10 },
//       { key: "R", label: "Right Side", defaultCols: 3, fixedRows: 9 },
//     ];

//     const observed = {};
//     roomData.allocations.forEach((a) => {
//       const parsed = parseSeatId(a.seatId);
//       if (!parsed) return;
//       if (!observed[parsed.side]) observed[parsed.side] = { rows: 0, cols: 0 };
//       observed[parsed.side].rows = Math.max(observed[parsed.side].rows, parsed.row);
//       observed[parsed.side].cols = Math.max(observed[parsed.side].cols, parsed.column);
//     });

//     const sections = sectionOrder.map((meta) => {
//       const rows = Math.max(meta.fixedRows, observed[meta.key]?.rows || 0);
//       const cols = Math.max(meta.defaultCols, observed[meta.key]?.cols || 0);
      
//       const matrix = [];
//       const colSubjects = {};

//       for (let c = 1; c <= cols; c++) {
//          let foundSubj = null;
//          for(let r=1; r<=rows; r++) {
//              const seatId = `${meta.key}${r}-${c}`;
//              const alloc = seatMap[seatId];
//              if(alloc && alloc.subjectCode) {
//                  foundSubj = String(alloc.subjectCode).split("_")[0].toUpperCase();
//                  break;
//              }
//          }
//          colSubjects[c] = foundSubj;
//       }

//       for (let r = 1; r <= rows; r++) {
//         const row = [];
//         for (let c = 1; c <= cols; c++) {
//           const seatId = `${meta.key}${r}-${c}`;
//           const allocation = seatMap[seatId];
//           const seat = allocation ? { roll: allocation.rollNo } : null;
//           row.push({ seat, column: c, seatId });
//         }
//         matrix.push(row);
//       }

//       return { ...meta, rows, cols, matrix, colSubjects };
//     });

//     return (
//       <div className="alt-layout">
//         <div className="alt-wall">WALL</div>
//         <div className="alt-sections">
//           {sections.map((section, idx) => (
//             <React.Fragment key={section.key}>
//               <div className="alt-section">
//                 <div className="alt-section-title">{section.label}</div>
//                 <table className="alt-table">
//                   <thead>
//                     <tr>
//                       {Array.from({ length: section.cols }, (_, i) => i + 1).map((c) => {
//                         const subj = section.colSubjects[c];
//                         const isVacant = !subj || (c === 2 && !subj); 
//                         return (
//                           <th key={c} className={!isVacant ? `subject-${(subj||"").toLowerCase()}` : "text-gray-300"}>
//                             <div className="col-head-number">{c}</div>
//                             <div className="font-bold text-xs">{isVacant ? "Vacant" : subj}</div>
//                           </th>
//                         );
//                       })}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {section.matrix.map((row, rIdx) => (
//                       <tr key={rIdx}>
//                         {row.map((cell, cIdx) => {
//                           const note = cellNotes[cell.seatId] || "";
//                           return (
//                             <td key={cIdx} className={cell.seat ? "seat-filled font-mono font-bold text-sm" : "seat-vacant"}>
//                               {cell.seat ? (
//                                 <div className="cell-content-wrapper">
//                                   <div className="cell-roll">{formatRoll(cell.seat.roll)}</div>
//                                   {note && <div className="cell-note">{note}</div>}
//                                 </div>
//                               ) : (
//                                 "Vacant"
//                               )}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               {idx < sections.length - 1 && <div className="alt-aisle">AISLE</div>}
//             </React.Fragment>
//           ))}
//         </div>
//         <div className="alt-wall bottom">WALL</div>
//         <div className="alt-totals">{displayData.totals}</div>
//       </div>
//     );
//   };

//   const renderStandardLayout = () => (
//     <>
//       <div className="seating-wrapper">
//         <div className="wall-block"><span>WALL</span></div>
//         <SideGrid title="Left Side" headers={displayData.leftSide.headers} rows={displayData.leftSide.rows} side="L" />
//         <div className="aisle-block"><span>AISLE</span></div>
//         <SideGrid title="Right Side" headers={displayData.rightSide.headers} rows={displayData.rightSide.rows} side="R" />
//         <div className="wall-block"><span>WALL</span></div>
//       </div>
//       <div className="seating-footer" style={{textAlign: 'center', marginTop: '1rem', fontWeight: 'bold', color: '#334155'}}>
//         <p>{displayData.totals}</p>
//       </div>
//     </>
//   );

//   const SideGrid = ({ title, headers, rows, side }) => (
//     <div className="side-grid">
//       <h3 className="side-grid-title">{title}</h3>
//       <div className="grid-container" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
//         {headers.map((header) => (
//           <div key={header.col} className="col-header-cell" style={{textAlign: 'center', padding: '4px', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 'bold'}}>
//             <span>{header.col}</span>
//             <span style={{display: 'block', color: '#2563eb'}}>{header.subject}</span>
//           </div>
//         ))}
//         {rows.map((row, rowIndex) =>
//           row.map((seat, colIndex) => {
//             const seatId = `${side}${rowIndex + 1}-${colIndex + 1}`;
//             const note = cellNotes[seatId] || "";
//             return (
//               <div key={`${title}-${rowIndex}-${colIndex}`} className={`desk-cell ${seat ? "bg-white" : "bg-gray-50 text-gray-300"}`}>
//                 {seat ? (
//                   <>
//                     <span className="font-bold text-slate-700">{seat.subjectShort}</span>
//                     <span className="font-mono text-gray-500">{formatRoll(seat.rollNo)}</span>
//                     {note && <span className="text-xs text-red-600 font-semibold italic">{note}</span>}
//                   </>
//                 ) : (
//                   "Vacant"
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className={`preview-root ${roomData.type === "LT" ? "lt-mode" : "default-mode"}`}>
//       <style>{styles}</style>
//       <header className="header">
//         <img src="/nitjlogo.png" alt="NITJ Logo" className="logo" />
//       </header>
//       <main className="main">
//         <section className="preview-card">
//           <div className="card-header">
//             <button className="back-btn" onClick={handleBack}>←</button>
//             <div className="card-title">
//               <p className="card-subtitle">{displayData.university}</p>
//               <h1>{displayData.examination}</h1>
//               <p className="card-plan">{displayData.planName}</p>
//             </div>
//             <div className="logo-placeholder" />
//           </div>
//           <div className="room-meta">
//             <p>
//               <span className="meta-label">ROOM NO.:</span> {displayData.roomNo}
//               <span className="meta-divider">|</span>
//               <span className="meta-batch">{displayData.batch}</span>
//             </p>
//           </div>
          
//           <div className="blackboard-bar">BLACK BOARD</div>
//           {roomData.type === "LT"
//             ? renderLTLayout()
//             : roomData.type === "ALT"
//               ? renderALTLayout()
//               : renderStandardLayout()}
//         </section>
        
//         <button className="edit-button-fixed" onClick={handleEdit}>
//           Edit Room
//         </button>
//       </main>
//     </div>
//   );
// };

// export default PreviewRoom;











import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./PreviewRoom.css";

const MOCK_ALT_DATA = {
  roomCode: "ALT-1",
  type: "ALT",
  capacity: 90,
  subjectPair: ["CS_301", "ME_301"],
  allocations: []
};

const sectionConfig = { L: 11, C: 10, R: 9 };
const sections = ["L", "C", "R"];

sections.forEach(side => {
  const rowLimit = sectionConfig[side];
  for (let r = 1; r <= rowLimit; r++) {
    for (let c = 1; c <= 3; c++) {
      if (c === 2) continue; 

      if (Math.random() > 0.2) { 
        MOCK_ALT_DATA.allocations.push({
          seatId: `${side}${r}-${c}`,
          rollNo: `210${Math.floor(1000 + Math.random() * 9000)}`,
          subjectCode: (r + c) % 2 === 0 ? "CS_301" : "ME_301"
        });
      }
    }
  }
});

const PreviewRoom = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // const { roomData, examData, onUpdate } = location.state || {};
  const state = location.state || {};
  const roomData = state.roomData;
  const examData = state.examData || {};
  const onUpdate = state.onUpdate;

  const safeExamData = examData || { date: new Date().toISOString() };

  const [cellNotes, setCellNotes] = useState({});


useEffect(() => {
  if (!roomData?.allocations) return;

  const notes = {};
  roomData.allocations.forEach(a => {
    if (a.note) notes[a.seatId] = a.note;
  });
  setCellNotes(notes);
}, [roomData]);


  
  const submitted = (() => {
    try {
      const raw = localStorage.getItem("submitDetails");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })();

 if (!roomData) {
  return (
    <div style={{ padding: "2rem" }}>
      <h2>No room data found</h2>
      <p>Please go back and select a room.</p>
      <button onClick={() => navigate("/room-allocation")}>
        Back to Room Allocation
      </button>
    </div>
  );
}


  const parseSeatId = (seatId) => {
    const match = seatId.match(/([LCR])(\d+)-(\d+)/);
    if (match) {
      return {
        side: match[1],
        row: parseInt(match[2]),
        column: parseInt(match[3]),
      };
    }
    return null;
  };

  const getLayoutDimensions = () => {
    let maxColumn = 0;
    let maxRow = 0;
    roomData.allocations.forEach((allocation) => {
      const parsed = parseSeatId(allocation.seatId);
      if (parsed) {
        maxColumn = Math.max(maxColumn, parsed.column);
        maxRow = Math.max(maxRow, parsed.row);
      }
    });
    return { columns: maxColumn, rows: maxRow };
  };

  const { columns, rows: rowsCount } = getLayoutDimensions();

  const subjectTags = (roomData?.subjectPair || []).map((s) => {
    const m = String(s).match(/[A-Za-z]+/);
    return m ? m[0].toUpperCase() : String(s).toUpperCase();
  });

  const seatMap = {};
  roomData.allocations.forEach((allocation) => {
    seatMap[allocation.seatId] = allocation;
  });

  const transformToGridData = () => {
    const leftHeaders = [];
    const rightHeaders = [];
    const leftRows = [];
    const rightRows = [];

    for (let c = 1; c <= columns; c++) {
      const subjectTag = subjectTags[(c - 1) % subjectTags.length];
      leftHeaders.push({ col: c, subject: subjectTag });
      rightHeaders.push({ col: c, subject: subjectTag });
    }

    for (let r = 1; r <= rowsCount; r++) {
      const leftRow = [];
      const rightRow = [];
      for (let c = 1; c <= columns; c++) {
        const leftSeatId = `L${r}-${c}`;
        const rightSeatId = `R${r}-${c}`;
        leftRow.push(seatMap[leftSeatId] ? { ...seatMap[leftSeatId], subjectShort: String(seatMap[leftSeatId].subjectCode).split("_")[0] } : null);
        rightRow.push(seatMap[rightSeatId] ? { ...seatMap[rightSeatId], subjectShort: String(seatMap[rightSeatId].subjectCode).split("_")[0] } : null);
      }
      leftRows.push(leftRow);
      rightRows.push(rightRow);
    }
    return { leftSide: { headers: leftHeaders, rows: leftRows }, rightSide: { headers: rightHeaders, rows: rightRows } };
  };

  const gridData = transformToGridData();

  const handleBack = () => {
    navigate("/room-allocation");
  };

  const handleEdit = () => {
  navigate("/edit-room", {
    state: {
      roomData,
      examData,
      // Remove onUpdate from here too
    }
  });
};


  const formatRoll = (roll) => {
    if (!roll) return "";
    const s = String(roll).replace(/\s+/g, "");
    const m = s.match(/(\d+)$/);
    return m ? m[0] : s;
  };

  const subjectCounts = roomData.subjectPair.reduce((acc, subj) => {
    acc[subj] = 0;
    return acc;
  }, {});
  roomData.allocations.forEach((a) => {
    if (subjectCounts[a.subjectCode] !== undefined) subjectCounts[a.subjectCode] += 1;
  });
  const totalSeats = Object.values(subjectCounts).reduce((s, n) => s + n, 0);
  
  const totalsText = subjectTags
    .map((tag, idx) => {
      const code = roomData.subjectPair[idx];
      const count = subjectCounts[code] || 0;
      return `${tag}-${count}`;
    })
    .join(" & ") + `, TOTAL = ${totalSeats}`;

 const planDateText = safeExamData?.date
  ? new Date(safeExamData.date).toLocaleString(undefined, { month: "long", year: "numeric" })
  : "December 2025";


  const displayData = {
    university: "DR BR Ambedkar National Institute of Technology, Jalandhar",
    examination: "EXAMINATION SECTION",
    planName: `Seating Plan End Semester Examinations ${planDateText}`,
    roomNo: roomData.roomCode,
    batch: submitted?.programme && submitted?.year
        ? `${submitted.programme.toUpperCase()} ${submitted.year} Semester (${submitted.batch || "2024 Batch"})`
        : "B Tech III Semester (2024 Batch)",
    totals: totalsText,
    leftSide: gridData.leftSide,
    rightSide: gridData.rightSide,
  };

  const styles = `
    .preview-root {
      background-color: #f1f5f9;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      font-family: 'Inter', sans-serif;
    }
    .header { background-color: #0f172a; padding: 1rem 2rem; display: flex; align-items: center; color: white; }
    .logo { height: 50px; }
    .main { flex: 1; padding: 2rem; display: flex; justify-content: center; position: relative; width: 100%; }

    
    
    .preview-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
      width: 100%;
      max-width: 95vw; 
      padding: 2rem;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .preview-root.lt-mode .preview-card {
      max-width: 100%;
    }
    
    .edit-button-fixed {
      position: fixed;
      bottom: 30px;
      right: 30px;
      padding: 14px 28px;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
      transition: all 0.3s ease;
      z-index: 1000;
    }
    
    .edit-button-fixed:hover {
      background: #1d4ed8;
      transform: translateY(-3px);
      box-shadow: 0 15px 35px rgba(37, 99, 235, 0.4);
    }
    
    .card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
    .back-btn { background: none; border: 1px solid #e2e8f0; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; color: #64748b; }
    .card-title { text-align: center; flex: 1; }
    .card-title h1 { font-size: 1.5rem; color: #0f172a; margin: 0.25rem 0; font-weight: 700; }
    .card-subtitle { font-size: 0.875rem; color: #64748b; font-weight: 500; text-transform: uppercase; }
    .card-plan { font-size: 0.9rem; color: #475569; }
    
    .room-meta { text-align: center; padding: 0.75rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; margin-bottom: 2rem; }
    .room-meta p { font-weight: 600; color: #334155; }
    
    .blackboard-bar { background: #0f172a; color: white; text-align: center; padding: 0.75rem; border-radius: 8px; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 2rem; }

    .lt-wall, .alt-wall {
      text-align: center;
      background-color: #f1f5f9;
      border: 1px solid #cbd5e1;
      padding: 0.5rem;
      font-weight: 700;
      color: #475569;
      letter-spacing: 2px;
      text-transform: uppercase;
      font-size: 0.8rem;
      margin-bottom: 1rem;
    }
    .lt-wall.bottom, .alt-wall.bottom { margin-top: 1rem; margin-bottom: 1rem; }
    
    .lt-layout { width: 100%; display: flex; flex-direction: column; }
    .lt-sections { display: flex; justify-content: center; gap: 1.5rem; }
    
    .lt-side { flex: 1; min-width: 520px; display: flex; flex-direction: column; align-items: center; }
    .lt-side-title { width: 100%; text-align: center; font-weight: 700; margin-bottom: 0.5rem; text-transform: uppercase; font-size: 0.85rem; color: #334155; }
    
    .lt-aisle {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      writing-mode: vertical-rl;
      text-orientation: mixed;
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #64748b;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 3px;
      border-radius: 20px;
      margin-top: 2rem;
    }

    .lt-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }
    
    .lt-table th {
      border: 1px solid #94a3b8;
      text-align: center;
      padding: 10px 6px;
      overflow: hidden;
      height: 36px;
      min-width: 90px;
    }
    .header-num {
      background-color: #f1f5f9;
      color: #64748b;
      font-size: 0.75rem;
    }
    .header-subj {
      background-color: #fff;
      color: #1e293b;
      font-size: 0.8rem;
      font-weight: 800;
      white-space: normal;
      word-break: break-word;
      line-height: 1.1;
    }
    
    .lt-table td {
      border: 1px solid #94a3b8;
      text-align: center;
      padding: 10px 6px;
      font-size: 11px;
      font-family: monospace;
      font-weight: 500;
      color: #334155;
      min-width: 90px;
      height: 36px;
      vertical-align: top;
    }
    
    .cell-content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
    }
    
    .cell-roll {
      font-size: 11px;
      font-family: monospace;
      font-weight: 500;
    }
    
    .cell-note {
      font-size: 9px;
      color: #dc2626;
      font-weight: 600;
      font-style: italic;
      text-transform: uppercase;
    }
    
    .seat-vacant { background-color: #f8fafc; color: #cbd5e1; font-style: italic; font-weight: 400; }
    .seat-filled { background-color: #fff; }

    .lt-totals { text-align: center; font-weight: 700; padding: 1rem; border: 1px solid #e2e8f0; border-radius: 6px; background: #f8fafc; color: #334155; }

    .alt-layout { display: flex; flex-direction: column; gap: 1rem; }
    .alt-sections { display: flex; justify-content: center; gap: 0.5rem; }
    .alt-section { flex: 1; min-width: 0; }
    .alt-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    .alt-table th, .alt-table td { border: 1px solid #cbd5e1; padding: 0.2px; text-align: center; vertical-align: center; }
    .alt-aisle { width: 30px; writing-mode: vertical-rl; background: #eef2f6; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: #64748b; }

    .seating-wrapper { display: flex; justify-content: center; gap: 1rem; }
    .wall-block { writing-mode: vertical-rl; background: #eef2f6; padding: 1rem 0.5rem; display: flex; align-items: center; border: 1px solid #cbd5e1; }
    .aisle-block { writing-mode: vertical-rl; background: #f1f5f9; padding: 1rem 0.5rem; display: flex; align-items: center; border: 1px dashed #cbd5e1; }
    .grid-container { display: grid; gap: 2px; background: #e2e8f0; padding: 2px; }
    .desk-cell { background: white; padding: 4px; min-width: 70px; height: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.75rem; gap: 2px; }
    
    @media print {
      .preview-root { background: white; padding: 0; }
      .header, .back-btn, .edit-button-fixed { display: none; }
      .preview-card { box-shadow: none; border: none; padding: 0; max-width: none; }
      .blackboard-bar { border: 1px solid #000; background: #ddd; color: black; }
    }
  `;

  const renderLTLayout = () => {
    const subjectSeq = (roomData?.subjectPair || [])
      .map((s) => String(s).split("_")[0].toUpperCase())
      .filter(Boolean);
    
    const buildSideMatrix = (sideLetter) => {
      const matrix = [];
      for (let r = 1; r <= rowsCount; r++) {
        const row = [];
        for (let c = 1; c <= columns; c++) {
          const seatId = `${sideLetter}${r}-${c}`;
          const alloc = seatMap[seatId];
          row.push(alloc ? alloc.rollNo : "");
        }
        matrix.push(row);
      }
      return matrix;
    };
    
    const leftMatrix = buildSideMatrix("L");
    const rightMatrix = buildSideMatrix("R");

    const colVacant = Array.from({ length: columns }, (_, idx) => {
      const leftEmpty = leftMatrix.every((row) => !row[idx]);
      const rightEmpty = rightMatrix.every((row) => !row[idx]);
      return leftEmpty && rightEmpty;
    });

    const getColumnSubject = (colIndex, side) => {
      const seq = subjectSeq.length ? subjectSeq : ["SUBJ"];
      
      if (colVacant[colIndex]) return "Vacant";
      
      let activeIdx = 0;
      for(let i=0; i<columns; i++) {
         if(!colVacant[i]) {
            if(side === 'L' && i === colIndex) return seq[activeIdx % seq.length];
            activeIdx++;
         }
      }
      for(let i=0; i<columns; i++) {
         if(!colVacant[i]) {
            if(side === 'R' && i === colIndex) return seq[activeIdx % seq.length];
            activeIdx++;
         }
      }
      return "Vacant";
    };

    const renderBlock = (title, matrix, side) => (
      <div className="lt-side">
        <div className="lt-side-title">{title}</div>
        <table className="lt-table">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={`n-${i}`} className="header-num">{i + 1}</th>
              ))}
            </tr>
            <tr>
              {Array.from({ length: columns }).map((_, i) => {
                const subj = getColumnSubject(i, side);
                const isVacant = colVacant[i];
                return (
                  <th key={`s-${i}`} className={`header-subj ${isVacant ? 'text-gray-400 font-normal' : ''}`}>
                    {subj}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rIdx) => (
              <tr key={rIdx}>
                {row.map((roll, cIdx) => {
                  const isVacantCol = colVacant[cIdx];
                  const content = roll || (isVacantCol ? "Vacant" : "");
                  const seatId = `${side}${rIdx + 1}-${cIdx + 1}`;
                  const note = cellNotes[seatId] || "";
                  
                  return (
                    <td key={cIdx} className={content && !isVacantCol ? "seat-filled" : "seat-vacant"}>
                      {content === "Vacant" ? (
                        "Vacant"
                      ) : content ? (
                        <div className="cell-content-wrapper">
                          <div className="cell-roll">{formatRoll(content)}</div>
                          {note && <div className="cell-note">{note}</div>}
                        </div>
                      ) : null}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="lt-layout">
        <div className="lt-wall">WALL</div>
        <div className="lt-sections">
          {renderBlock("Left Side Columns", leftMatrix, "L")}
          
          <div className="lt-aisle">
            <span>AISLE</span>
          </div>
          
          {renderBlock("Right Side Columns", rightMatrix, "R")}
        </div>
        <div className="lt-wall bottom">WALL</div>
        <div className="lt-totals">{displayData.totals}</div>
      </div>
    );
  };

  const renderALTLayout = () => {
    const sectionOrder = [
      { key: "L", label: "Left Side", defaultCols: 3, fixedRows: 11 },
      { key: "C", label: "Centre", defaultCols: 3, fixedRows: 10 },
      { key: "R", label: "Right Side", defaultCols: 3, fixedRows: 9 },
    ];

    const observed = {};
    roomData.allocations.forEach((a) => {
      const parsed = parseSeatId(a.seatId);
      if (!parsed) return;
      if (!observed[parsed.side]) observed[parsed.side] = { rows: 0, cols: 0 };
      observed[parsed.side].rows = Math.max(observed[parsed.side].rows, parsed.row);
      observed[parsed.side].cols = Math.max(observed[parsed.side].cols, parsed.column);
    });

    const sections = sectionOrder.map((meta) => {
      const rows = Math.max(meta.fixedRows, observed[meta.key]?.rows || 0);
      const cols = Math.max(meta.defaultCols, observed[meta.key]?.cols || 0);
      
      const matrix = [];
      const colSubjects = {};

      for (let c = 1; c <= cols; c++) {
         let foundSubj = null;
         for(let r=1; r<=rows; r++) {
             const seatId = `${meta.key}${r}-${c}`;
             const alloc = seatMap[seatId];
             if(alloc && alloc.subjectCode) {
                 foundSubj = String(alloc.subjectCode).split("_")[0].toUpperCase();
                 break;
             }
         }
         colSubjects[c] = foundSubj;
      }

      for (let r = 1; r <= rows; r++) {
        const row = [];
        for (let c = 1; c <= cols; c++) {
          const seatId = `${meta.key}${r}-${c}`;
          const allocation = seatMap[seatId];
          const seat = allocation ? { roll: allocation.rollNo } : null;
          row.push({ seat, column: c, seatId });
        }
        matrix.push(row);
      }

      return { ...meta, rows, cols, matrix, colSubjects };
    });

    return (
      <div className="alt-layout">
        <div className="alt-wall">WALL</div>
        <div className="alt-sections">
          {sections.map((section, idx) => (
            <React.Fragment key={section.key}>
              <div className="alt-section">
                <div className="alt-section-title">{section.label}</div>
                <table className="alt-table">
                  <thead>
                    <tr>
                      {Array.from({ length: section.cols }, (_, i) => i + 1).map((c) => {
                        const subj = section.colSubjects[c];
                        const isVacant = !subj || (c === 2 && !subj); 
                        return (
                          <th key={c} className={!isVacant ? `subject-${(subj||"").toLowerCase()}` : "text-gray-300"}>
                            <div className="col-head-number">{c}</div>
                            <div className="font-bold text-xs">{isVacant ? "Vacant" : subj}</div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {section.matrix.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => {
                          const note = cellNotes[cell.seatId] || "";
                          return (
                            <td key={cIdx} className={cell.seat ? "seat-filled font-mono font-bold text-sm" : "seat-vacant"}>
                              {cell.seat ? (
                                <div className="cell-content-wrapper">
                                  <div className="cell-roll">{formatRoll(cell.seat.roll)}</div>
                                  {note && <div className="cell-note">{note}</div>}
                                </div>
                              ) : (
                                "Vacant"
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {idx < sections.length - 1 && <div className="alt-aisle">AISLE</div>}
            </React.Fragment>
          ))}
        </div>
        <div className="alt-wall bottom">WALL</div>
        <div className="alt-totals">{displayData.totals}</div>
      </div>
    );
  };

  const renderStandardLayout = () => (
    <>
      <div className="seating-wrapper">
        <div className="wall-block"><span>WALL</span></div>
        <SideGrid title="Left Side" headers={displayData.leftSide.headers} rows={displayData.leftSide.rows} side="L" />
        <div className="aisle-block"><span>AISLE</span></div>
        <SideGrid title="Right Side" headers={displayData.rightSide.headers} rows={displayData.rightSide.rows} side="R" />
        <div className="wall-block"><span>WALL</span></div>
      </div>
      <div className="seating-footer" style={{textAlign: 'center', marginTop: '1rem', fontWeight: 'bold', color: '#334155'}}>
        <p>{displayData.totals}</p>
      </div>
    </>
  );

  const SideGrid = ({ title, headers, rows, side }) => (
    <div className="side-grid">
      <h3 className="side-grid-title">{title}</h3>
      <div className="grid-container" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
        {headers.map((header) => (
          <div key={header.col} className="col-header-cell" style={{textAlign: 'center', padding: '4px', background: '#f1f5f9', fontSize: '0.75rem', fontWeight: 'bold'}}>
            <span>{header.col}</span>
            <span style={{display: 'block', color: '#2563eb'}}>{header.subject}</span>
          </div>
        ))}
        {rows.map((row, rowIndex) =>
          row.map((seat, colIndex) => {
            const seatId = `${side}${rowIndex + 1}-${colIndex + 1}`;
            const note = cellNotes[seatId] || "";
            return (
              <div key={`${title}-${rowIndex}-${colIndex}`} className={`desk-cell ${seat ? "bg-white" : "bg-gray-50 text-gray-300"}`}>
                {seat ? (
                  <>
                    <span className="font-bold text-slate-700">{seat.subjectShort}</span>
                    <span className="font-mono text-gray-500">{formatRoll(seat.rollNo)}</span>
                    {note && <span className="text-xs text-red-600 font-semibold italic">{note}</span>}
                  </>
                ) : (
                  "Vacant"
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );

  return (
    <div className={`preview-root ${roomData.type === "LT" ? "lt-mode" : "default-mode"}`}>
      <style>{styles}</style>
      <header className="header">
        <img src="/nitjlogo.png" alt="NITJ Logo" className="logo" />
      </header>
      <main className="main full-width-main">
  <section className="preview-card">
    <div className="card-header">
      <button className="back-btn" onClick={handleBack}>←</button>

      <div className="card-title">
        <p className="card-subtitle">{displayData.university}</p>
        <h1>{displayData.examination}</h1>
        <p className="card-plan">{displayData.planName}</p>
      </div>

      <div className="logo-placeholder" />
    </div>

    <div className="room-meta">
      <p>
        <span className="meta-label">ROOM NO.:</span> {displayData.roomNo}
        <span className="meta-divider">|</span>
        <span className="meta-batch">{displayData.batch}</span>
      </p>
    </div>

    <div className="blackboard-bar">BLACK BOARD</div>

    {roomData.type === "LT"
      ? renderLTLayout()
      : roomData.type === "ALT"
        ? renderALTLayout()
        : renderStandardLayout()}
  </section>

  <button className="edit-button-fixed" onClick={handleEdit}>
    Edit Room
  </button>
</main>

    </div>
  );
};

export default PreviewRoom;