const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const DATA_FILE = "./customers.json";

/*
=================================
GET ALL CUSTOMERS
=================================
*/

app.get("/api/customers", (req, res) => {
    try {
        const customers = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );

        res.json(customers);
    } catch (error) {
        res.json([]);
    }
});

/*
=================================
ADD CUSTOMER
=================================
*/

app.post("/api/customers", (req, res) => {

    const { name, phone } = req.body;

    let customers = [];

    try {
        customers = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (error) {
        customers = [];
    }

    const newCustomer = {
        id: Date.now(),
        name,
        phone
    };

    customers.push(newCustomer);

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(customers, null, 2)
    );

    res.json({
        success: true,
        customer: newCustomer
    });
});

/*
=================================
DELETE CUSTOMER
=================================
*/

app.delete("/api/customers/:id", (req, res) => {

    const id = Number(req.params.id);

    let customers = [];

    try {
        customers = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (error) {
        customers = [];
    }

    customers = customers.filter(
        customer => customer.id !== id
    );

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(customers, null, 2)
    );

    res.json({
        success: true
    });
});

/*
=================================
STATS
=================================
*/

app.get("/api/stats", (req, res) => {

    let customers = [];

    try {
        customers = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (error) {
        customers = [];
    }

    res.json({
        totalCustomers: customers.length
    });
});

/*
=================================
GENERATE CAMPAIGN
=================================
*/

app.post("/api/campaign", (req, res) => {

    const { message } = req.body;

    let customers = [];

    try {
        customers = JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (error) {
        customers = [];
    }

    const campaignLinks = customers.map(customer => ({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
        link: `https://wa.me/${customer.phone}?text=${encodeURIComponent(message)}`
    }));

    res.json(campaignLinks);
});

/*
=================================
HOME PAGE
=================================
*/

app.get("*", (req, res) => {
    res.sendFile(
        path.join(__dirname, "public", "index.html")
    );
});

/*
=================================
START SERVER
=================================
*/

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});