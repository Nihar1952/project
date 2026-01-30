const express = require("express");
const { connectDB } = require("./db/mongo");

const uploadRoute = require("./api/upload");
const downloadRoute = require("./api/download");

const app = express();
app.use(express.json());

app.use("/upload", uploadRoute);
app.use("/download", downloadRoute);

(async () => {
  await connectDB();
  app.listen(3000, () =>
    console.log("🚀 Server running on http://localhost:3000")
  );
})();
