const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));

const DATA_FILE = "./customers.json";

/*
-----------------------------------
GET ALL CUSTOMERS
-----------------------------------
*/
app.get("/api/customers", (req, res) => {

    const customers =
        JSON.parse(
            fs.readFileSync(DATA_FILE)
        );

    res.json(customers);
});

/*
-----------------------------------
ADD CUSTOMER
-----------------------------------
*/
app.post("/api/customers", (req, res) => {

    const { name, phone } = req.body;

    const customers =
        JSON.parse(
            fs.readFileSync(DATA_FILE)
        );

    const newCustomer = {
        id: Date.now(),
        name,
        phone
    };

    customers.push(newCustomer);

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
            customers,
            null,
            2
        )
    );

    res.json({
        success: true,
        customer: newCustomer
    });
});

/*
-----------------------------------
DELETE CUSTOMER
-----------------------------------
*/
app.delete("/api/customers/:id", (req, res) => {

    const id =
        Number(req.params.id);

    let customers =
        JSON.parse(
            fs.readFileSync(DATA_FILE)
        );

    customers =
        customers.filter(
            customer =>
                customer.id !== id
        );

    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(
            customers,
            null,
            2
        )
    );

    res.json({
        success: true
    });
});

/*
-----------------------------------
GENERATE CAMPAIGN
-----------------------------------
*/
app.post("/api/campaign", (req, res) => {

    const { message } = req.body;

    const customers =
        JSON.parse(
            fs.readFileSync(DATA_FILE)
        );

    const links =
        customers.map(customer => {

            const whatsappLink =
                `https://wa.me/91${customer.phone}?text=${encodeURIComponent(message)}`;

            return {
                name: customer.name,
                phone: customer.phone,
                link: whatsappLink
            };
        });

    res.json(links);
});

/*
-----------------------------------
DASHBOARD STATS
-----------------------------------
*/
app.get("/api/stats", (req, res) => {

    const customers =
        JSON.parse(
            fs.readFileSync(DATA_FILE)
        );

    res.json({
        totalCustomers:
            customers.length
    });
});

/*
-----------------------------------
START SERVER
-----------------------------------
*/
const PORT =
    process.env.PORT || 3000;

app.listen(PORT, () => {

    console.log(
        `Server running on port ${PORT}`
    );

});