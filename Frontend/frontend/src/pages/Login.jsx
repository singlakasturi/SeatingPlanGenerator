// import React, { useEffect } from "react";
// import "./login.css";

// export default function Login() {
//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const email = urlParams.get("email");
//     const error = urlParams.get("error");

//     if (error === "invalid_email") {
//       alert("⚠️ Please use your college email (@nitj.ac.in)");
//       window.history.replaceState({}, document.title, "/");
//     } else if (email) {
//       alert(`✅ Logged in as ${email}`);
//       window.history.replaceState({}, document.title, "/upload");
//       window.location.href = "/upload";
//     }
//   }, []);

//   const handleGoogleLogin = () => {
//     window.location.href = "http://localhost:5000/auth/google";
//   };

//   return (
//     <div>
//       <header className="header">
//         <img src="/nitjlogo.png" alt="NITJ Logo" />
//       </header>

//       <div className="nav-bar">
//         <div className="nav-left">
//           <img src="/seating planner logo.png" alt="Seating Planner Logo" />
//           <span>| SEATING PLANNER - NITJ |</span>
//         </div>

//         <div className="nav-right">
//           <a href="#">CONTACT US</a>
//           <a href="#" id="signup">
//             SIGN IN
//           </a>
//         </div>
//       </div>

//       <div className="main">
//         <div className="text-section">
//           <h2>Welcome!!</h2>
//           <h1>SEATING PLAN PROJECT</h1>
//           <p>
//             Seating Plan Portal is an advanced exam seating planner designed to
//             simplify and digitalize exam management. We provide time-saving
//             tools for schools, colleges, and institutions to create and manage
//             exam seating plans efficiently and effortlessly.
//           </p>
//           <button
//             className="btn-google"
//             type="button"
//             onClick={handleGoogleLogin}
//             aria-label="Sign in with Google"
//           >
//             <img
//               src="https://www.svgrepo.com/show/475656/google-color.svg"
//               alt="Google logo"
//             />
//             <span>Sign in with Google</span>
//           </button>
//         </div>

//         <div className="image-section">
//           <img src="/homepage img.webp" alt="Team illustration" />
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useEffect } from "react";
import "./login.css";

export default function Login() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get("email");
    const error = urlParams.get("error");

    if (error === "invalid_email") {
      alert("⚠️ Please use your college email (@nitj.ac.in)");
      window.history.replaceState({}, document.title, "/");
    } else if (email) {
      alert(`✅ Logged in as ${email}`);

      // Remove query params
      window.history.replaceState({}, document.title, "/submit-details");

      // Redirect to submit-details page
      window.location.href = "/submit-details";
    }
  }, []);

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/auth/google";
  };

  return (
    <div>
      <header className="header">
        <img src="/nitjlogo.png" alt="NITJ Logo" />
      </header>

      <div className="nav-bar">
        <div className="nav-left">
          <img src="frontend\public\Seating_planner.png" alt="Seating Planner Logo" />
          <span>| SEATING PLANNER - NITJ |</span>
        </div>

        <div className="nav-right">
          <a href="#">CONTACT US</a>
          <a href="#" id="signup">
            SIGN IN
          </a>
        </div>
      </div>

      <div className="main">
        <div className="text-section">
          <h2>Welcome!!</h2>
          <h1>SEATING PLAN PROJECT</h1>
          <p>
            Seating Plan Portal is an advanced exam seating planner designed to
            simplify and digitalize exam management. We provide time-saving
            tools for schools, colleges, and institutions to create and manage
            exam seating plans efficiently and effortlessly.
          </p>

          <button
            className="btn-google"
            type="button"
            onClick={handleGoogleLogin}
            aria-label="Sign in with Google"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google logo"
            />
            <span>Sign in with Google</span>
          </button>
        </div>

        <div className="image-section">
          <img src="/homepage img.webp" alt="Team illustration" />
        </div>
      </div>
    </div>
  );
}
