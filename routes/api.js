import express from "express";
import { pool } from "../routes/pool.js"; // Import the pool

const router = express.Router();
const FormAPI_ = process.env.FORM_API_KEY;

router.use(express.json());

async function getTicketByNumber(ticketNumber) {
    try {
        const query = 'SELECT * FROM "Ticket" WHERE "ticketno" = $1'; // Parameterized query
        const result = await pool.query(query, [ticketNumber]);
        result.rows.forEach((row) => {
            row.auditTrail = JSON.stringify(row.auditTrail);
        });
        return result.rows[0]; // Return a single matching ticket
    } catch (err) {
        console.error("Database connection error:", err);
    }
}


router.get("/tickets/:ticketNumber", async (req, res) => {
    const ticket = await getTicketByNumber(req.params.ticketNumber);
    if (ticket) {
        res.json(ticket);
    } else {
        res.status(404).json({ message: "Ticket not found" });
    }
});


router.post("/add-ticket", async (req, res) => {
    console.log("Incoming request body:", req.body);

    const {
        ticketno,
        name,
        title,
        status,
        createdDate,
        lastUpdated,
        auditTrail,
    } = req.body;

    // Validate fields
    if (!ticketno) {
        return res.status(400).json({ error: "Ticket Number is required." });
    }
    if (!name) {
        return res.status(400).json({ error: "Name is required." });
    }
    if (!title) {
        return res.status(400).json({ error: "Title is required." });
    }
    if (!status) {
        return res.status(400).json({ error: "Status is required." });
    }
    if (!createdDate) {
        return res.status(400).json({ error: "Created Date is required." });
    }
    if (!lastUpdated) {
        return res.status(400).json({ error: "Last Updated is required." });
    }
    if (!Array.isArray(auditTrail)) {
        return res.status(400).json({ error: "Audit Trail must be an array." });
    }

    try {
        const query = `
        INSERT INTO "Ticket" (ticketno, name, title, status, "createdDate", "lastUpdated", "auditTrail")
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
        `;
        const values = [
            ticketno,
            name,
            title,
            status,
            createdDate,
            lastUpdated,
            JSON.stringify(auditTrail), // Convert array to JSON string for JSONB
        ];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Ticket added successfully!",
            ticket: result.rows[0],
        });
    } catch (err) {
        console.error("Error adding ticket:", err);
        res.status(500).json({ error: "Failed to add ticket." });
    }
});

/*

curl -X POST http://localhost:3000/api/add-ticket \
-H "Content-Type: application/json" \
-d "{
  \"ticketno\": \"T000111336\", 
  \"name\": \"John Doe\",
  \"title\": \"Sample Ticket\",
  \"status\": \"Open\",
  \"createdDate\": \"2025-02-27\",
  \"lastUpdated\": \"2025-02-27\",
  \"auditTrail\": [
    {\"type\":\"status\",\"action\":\"Ticket Created\",\"timestamp\":\"2024-11-14T08:45:00Z\"},
    {\"type\":\"update\",\"action\":\"Status changed to 'In Progress'\",\"timestamp\":\"2024-11-14T09:30:00Z\"},
    {\"type\":\"update\",\"action\":\"Network Issue Investigated\",\"timestamp\":\"2024-11-14T10:00:00Z\"},
    {\"type\":\"status\",\"action\":\"Status changed to 'Resolved'\",\"timestamp\":\"2024-11-15T10:00:00Z\"}
  ]
}"


*/
router.get("/get-ticket/:ticketno", async (req, res) => {
    const { ticketno } = req.params;

    try {
        const query = `
        SELECT * FROM "Ticket" WHERE ticketno = $1;
        `;
        const result = await pool.query(query, [ticketno]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket not found." });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Error fetching ticket:", err);
        res.status(500).json({ error: "Failed to fetch ticket." });
    }
});
router.put("/update-ticket", async (req, res) => {
    const { ticketno, status, lastUpdated, auditTrail } = req.body;

    if (!ticketno || !status || !lastUpdated || !Array.isArray(auditTrail)) {
        return res.status(400).json({
            error: "Invalid request. Fields 'ticketno', 'status', 'lastUpdated', and 'auditTrail' are required.",
        });
    }

    try {
        const query = `
        UPDATE "Ticket"
        SET status = $1, "lastUpdated" = $2, "auditTrail" = $3
        WHERE ticketno = $4
        RETURNING *;
        `;
        const values = [status, lastUpdated, JSON.stringify(auditTrail), ticketno];

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Ticket not found." });
        }

        res.json({
            message: "Ticket updated successfully!",
            ticket: result.rows[0],
        });
    } catch (err) {
        console.error("Error updating ticket:", err);
        res.status(500).json({ error: "Failed to update ticket." });
    }
});

export default router; 