const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = path.join(__dirname, "customers.json");

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Get all customers
app.get("/api/customers", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const customers = JSON.parse(data);
    res.json(customers);
  } catch (error) {
    res.json([]);
  }
});

// Add customer
app.post("/api/customers", (req, res) => {
  try {
    const newCustomer = req.body;

    let customers = [];

    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, "utf8");
      customers = JSON.parse(data);
    }

    customers.push(newCustomer);

    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(customers, null, 2)
    );

    res.json({
      success: true,
      message: "Customer added successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Dashboard stats
app.get("/api/stats", (req, res) => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    const customers = JSON.parse(data);

    res.json({
      totalCustomers: customers.length,
      campaignsSent: 12,
      messagesDelivered: customers.length * 3,
    });
  } catch (error) {
    res.json({
      totalCustomers: 0,
      campaignsSent: 0,
      messagesDelivered: 0,
    });
  }
});

// Generate campaign
app.post("/api/campaign", (req, res) => {
  const { message } = req.body;

  res.json({
    success: true,
    campaignMessage: message,
    sentTo: "All Customers",
    status: "Campaign Generated Successfully",
  });
});

// Render Port
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});