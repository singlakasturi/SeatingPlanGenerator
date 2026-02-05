import sql from "mssql";

const config = {
  user: "backend_user",
  password: "1234",
  server: "localhost\\SQLEXPRESS",
  database: "NITJ_SEATING",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

export default config;
