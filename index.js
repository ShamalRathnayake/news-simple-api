const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const adminRoutes = require("./src/routes/admin.router");
const newsRoutes = require("./src/routes/news.router");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/news", newsRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the News API!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
