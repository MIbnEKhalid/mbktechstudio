import express from "express";
import { pool } from "../routes/pool.js";
import { pool1 } from "../routes/pool1.js";
import { authenticate } from "./auth.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';

const app = express.Router(); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

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

app.get("/tickets/:ticketNumber", async (req, res) => {
    const ticket = await getTicketByNumber(req.params.ticketNumber);
    if (ticket) {
        res.json(ticket);
    } else {
        res.status(404).json({ message: "Ticket not found" });
    }
});

app.get("/tickets", async (req, res) => {
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

app.get("/get-ticket/:ticketno", async (req, res) => {
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

app.put("/update-ticket", async (req, res) => {
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

/* Api */

app.get("/script/setup.sh", authenticate(process.env.SetupScript_SECRET_TOKEN), (req, res) => {
    const scriptPath = path.join(__dirname, '../public/Assets/setup.sh');
    fs.readFile(scriptPath, 'utf8', (err, data) => {
        if (err) {
            console.error("Error reading script file:", err);
            return res.status(500).send("Internal Server Error");
        }

        const scriptContent = data
            .replace(/\${APACHE_LOG_DIR}/g, "${APACHE_LOG_DIR}")
            .replace(/\${process.env.ScriptGithubToken}/g, process.env.ScriptGithubToken);

        res.setHeader('Content-Type', 'application/x-sh');
        res.send(scriptContent);
    });
});

async function getAllQuizAss() {
    try {
        const query = 'SELECT * FROM "quizass"';
        const result = await pool1.query(query);
        console.log("QuizAss Api Request processed successfully");
        return result.rows;
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

async function getAllBooks() {
    try {
        const query = 'SELECT * FROM "unilibbook"'; // Ensure the table name matches the exact case
        const result = await pool1.query(query);
        console.log("Book Api Request processed successfully");
        return result.rows;
    } catch (err) {
        console.error("Database connection error:", err);
    }
}

app.get("/Unilib/Book", async (req, res) => {
    try {
        const result = await getAllBooks();
        res.json(result);
    } catch (err) {
        res.status(500).send("Internal Server Error: " + err);
    }
});

app.get("/Unilib/QuizAss", async (req, res) => {
    try {
        const result = await getAllQuizAss();
        res.json(result);
    } catch (err) {
        res.status(500).send("Internal Server Error: " + err);
    }
});

app.get("/poratlAppVersion", (req, res) => {
    const response = JSON.parse(process.env.PortalVersonControlJson);
    console.log("PortalVersonControlJson Api Request processed successfully");
    res.status(200).json(response);
});

app.get("/Test", authenticate(process.env.Main_SECRET_TOKEN), (req, res) => {
    console.log("API 'Test' Request processed successfully");
    res.send("API 'Test' Request processed successfully");
}); 

export default app;