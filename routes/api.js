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

router.get("/tickets", async (req, res) => {
    try {
        const query = 'SELECT * FROM "Ticket"';
        const result = await pool.query(query);
        result.rows.forEach((row) => {
            row.auditTrail = JSON.stringify(row.auditTrail);
        });
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching tickets:", err);
        res.status(500).json({ error: "Failed to fetch tickets." });
    }
});
 
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