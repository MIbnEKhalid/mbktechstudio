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
    if (!ticketno) {
        return res.status(400).json({ error: "Ticket Number is required." });
    } else if (!name) {
        return res.status(400).json({ error: "Name is required." });
    } else if (!title) {
        return res.status(400).json({ error: "Title is required." });
    } else if (!status) {
        return res.status(400).json({ error: "Status is required." });
    } else if (!createdDate) {
        return res.status(400).json({ error: "Created Date is required." });
    } else if (!lastUpdated) {
        return res.status(400).json({ error: "Last Updated is required." });
    } else if (!auditTrail) {
        return res.status(400).json({ error: "Audit Trail is required." });
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
            auditTrail,
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

export default router; 