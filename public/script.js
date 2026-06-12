const API_URL = "";

/*
=================================
LOAD DASHBOARD
=================================
*/

window.onload = () => {
    loadCustomers();
    loadStats();
};

/*
=================================
LOAD CUSTOMERS
=================================
*/

async function loadCustomers() {

    const response =
        await fetch("/api/customers");

    const customers =
        await response.json();

    const table =
        document.getElementById(
            "customerTable"
        );

    table.innerHTML = "";

    customers.forEach(customer => {

        table.innerHTML += `

        <tr>

            <td>
                ${customer.name}
            </td>

            <td>
                ${customer.phone}
            </td>

            <td>

                <button

                    class="delete-btn"

                    onclick="deleteCustomer(${customer.id})"

                >
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

/*
=================================
ADD CUSTOMER
=================================
*/

async function addCustomer() {

    const name =
        document.getElementById(
            "name"
        ).value;

    const phone =
        document.getElementById(
            "phone"
        ).value;

    if (!name || !phone) {

        alert(
            "Please enter name and phone"
        );

        return;
    }

    await fetch("/api/customers", {

        method: "POST",

        headers: {
            "Content-Type":
                "application/json"
        },

        body: JSON.stringify({

            name,
            phone

        })

    });

    document.getElementById(
        "name"
    ).value = "";

    document.getElementById(
        "phone"
    ).value = "";

    loadCustomers();
    loadStats();

    alert(
        "Customer Added"
    );

}

/*
=================================
DELETE CUSTOMER
=================================
*/

async function deleteCustomer(id) {

    if (
        !confirm(
            "Delete customer?"
        )
    ) {
        return;
    }

    await fetch(

        `/api/customers/${id}`,

        {
            method: "DELETE"
        }

    );

    loadCustomers();
    loadStats();

}

/*
=================================
LOAD STATS
=================================
*/

async function loadStats() {

    const response =
        await fetch("/api/stats");

    const stats =
        await response.json();

    document.getElementById(
        "totalCustomers"
    ).innerText =
        stats.totalCustomers;

}

/*
=================================
GENERATE CAMPAIGN
=================================
*/

async function generateCampaign() {

    const message =
        document.getElementById(
            "campaignMessage"
        ).value;

    if (!message) {

        alert(
            "Enter campaign message"
        );

        return;
    }

    const response =
        await fetch(
            "/api/campaign",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    message
                })
            }
        );

    const links =
        await response.json();

    const campaignLinks =
        document.getElementById(
            "campaignLinks"
        );

    campaignLinks.innerHTML = "";

    links.forEach(item => {

        campaignLinks.innerHTML += `

        <div class="link-box">

            <strong>
                ${item.name}
            </strong>

            <br><br>

            <a

                href="${item.link}"

                target="_blank"

            >
                Open WhatsApp
            </a>

        </div>

        `;

    });

}