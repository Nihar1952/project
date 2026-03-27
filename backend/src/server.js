const express = require("express");
const cors = require("cors");

const connectDB = require("./db/mongo");

const authRoutes = require("./auth");
const uploadRoutes = require("./api/upload");
const downloadRoutes = require("./api/download");
const auditRoutes = require("./api/audit");
const fileRoutes = require("./api/files");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/files", fileRoutes);

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
