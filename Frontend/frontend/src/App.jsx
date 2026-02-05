import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import ControlCenter from "./pages/ControlCenter";
import SubmitDetails from "./pages/SubmitDetails";
import RoomAllocation from "./pages/RoomAllocation";
import PreviewRoom from "./pages/PreviewRoom";
import EditRoom from "./pages/EditRoom";
import SubjectPairing from "./pages/SubjectPairing";

function ProtectedRoute({ loggedIn, loading, children }) {
  if (loading) return null;
  if (!loggedIn) return <Navigate to="/login" />;
  return children;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/auth/status", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setLoggedIn(data.loggedIn);
        setLoading(false);
      })
      .catch(() => {
        setLoggedIn(false);
        setLoading(false);
      });
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={!loggedIn ? <Login /> : <Navigate to="/control-center" />}
        />

        <Route
          path="/control-center"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <ControlCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/submit-details"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <SubmitDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room-allocation"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <RoomAllocation />
            </ProtectedRoute>
          }
        />

        <Route
          path="/subject-pairing"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <SubjectPairing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/preview-room"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <PreviewRoom />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-room"
          element={
            <ProtectedRoute loggedIn={loggedIn} loading={loading}>
              <EditRoom />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
