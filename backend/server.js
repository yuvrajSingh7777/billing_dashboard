const express = require("express");
const cors    = require("cors");
require("dotenv").config();

const customerRoutes = require("./routes/customers");
const itemRoutes     = require("./routes/items");
const invoiceRoutes  = require("./routes/invoices");

const app  = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

app.use("/api/customers", customerRoutes);
app.use("/api/items",     itemRoutes);
app.use("/api/invoices",  invoiceRoutes);

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: " API running" });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(` Backend running on http://localhost:${PORT}`);
});