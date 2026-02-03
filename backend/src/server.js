const express = require("express");
const cors = require("cors");

const connectDB = require("./db/mongo");

const authRoutes = require("./auth");
const uploadRoutes = require("./api/upload");
const downloadRoutes = require("./api/download");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/download", downloadRoutes);

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
})();
