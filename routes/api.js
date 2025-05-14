import express from "express";
import { pool } from "../routes/pool.js";
import { pool1 } from "../routes/pool1.js";
import { authenticate } from "./auth.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { console } from "inspector";

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

app.get("/Unilib/Book", async (req, res) => {
    console.log("UnilibBook Api Request processed successfully");
  try {
    const { page = 1, limit = 10, semester, category, search } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM unilibbook';
    let conditions = [];
    let params = [];
    
    if (semester) {
      conditions.push(`semester = $${params.length + 1}`);
      params.push(semester);
    }
    
    if (category && category !== 'all') {
      conditions.push(`category = $${params.length + 1}`);
      params.push(category);
    }
    
    if (search) {
      conditions.push(`name ILIKE $${params.length + 1}`);
      params.push(`%${search}%`);
    }
    
    if (conditions.length) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add sorting (main books first, then by name)
    query += ' ORDER BY main DESC, name ASC';
    
    // Add pagination
    const countQuery = `SELECT COUNT(*) FROM (${query}) as total`;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    
    const result = await pool1.query(query, params);
    const countResult = await pool1.query(countQuery, params.slice(0, -2));
    const total = parseInt(countResult.rows[0].count);
    const pages = Math.ceil(total / limit);
    
    res.json({
      data: result.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages
      }
    });
  } catch (err) {
    console.error("Error fetching books:", err);
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