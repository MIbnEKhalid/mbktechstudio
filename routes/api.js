import express from "express";
import { pool, pool1 } from "../routes/pool.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from 'fs';
import { console } from "inspector";

// Import security middleware
import {
    ticketSearchRateLimit,
    cacheMiddleware
} from '../middleware/security.js';

const app = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());

async function getTicketByNumber(ticketNumber) {
    try {
        // First try the new support_submissions table
        const newQuery = 'SELECT * FROM support_submissions WHERE ticket_number = $1 AND ticket_number IS NOT NULL';
        const newResult = await pool.query(newQuery, [ticketNumber]);

        if (newResult.rows.length > 0) {
            const submission = newResult.rows[0];
            // Transform to match expected format
            return {
                ticketno: submission.ticket_number,
                name: submission.name,
                title: `${submission.subject}${submission.support_type ? ' / ' + submission.support_type : ''}${submission.project_category ? ' / ' + submission.project_category : ''}`,
                status: capitalizeFirst(submission.status),
                createdDate: submission.submission_timestamp,
                lastUpdated: submission.last_updated,
                auditTrail: submission.audit_trail || []
            };
        }

        // Fallback to old Ticket table for backward compatibility
        const oldQuery = 'SELECT * FROM "Ticket" WHERE "ticketno" = $1';
        const oldResult = await pool.query(oldQuery, [ticketNumber]);

        if (oldResult.rows.length > 0) {
            const ticket = oldResult.rows[0];
            ticket.auditTrail = JSON.stringify(ticket.auditTrail);
            return ticket;
        }

        return null;
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
}

// Helper function to capitalize first letter
function capitalizeFirst(str) {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

app.get("/tickets/:ticketNumber", ticketSearchRateLimit, cacheMiddleware(120), async (req, res) => {
    try {
        const ticketNumber = req.params.ticketNumber;
        // Basic validation for ticket number format
        if (!ticketNumber || !/^T\d+$/.test(ticketNumber)) {
            return res.status(400).json({
                message: "Invalid ticket number format",
                expected: "Format: T followed by numeric digits"
            });
        }

        const ticket = await getTicketByNumber(ticketNumber);
        if (ticket) {
            res.json(ticket);
        } else {
            res.status(404).json({ message: "Ticket not found" });
        }
    } catch (error) {
        console.error('Error fetching ticket:', error);
        res.status(500).json({ message: "Internal server error" });
    }
});

/* Api */

app.get("/script/setup.sh", (req, res) => {
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

app.get("/poratlAppVersion", cacheMiddleware(3600), (req, res) => {
    const response = JSON.parse(process.env.PortalVersonControlJson);
    console.log("PortalVersonControlJson Api Request processed successfully");
    res.status(200).json(response);
});

app.get("/Test", (req, res) => {
    console.log("API 'Test' Request processed successfully");
    res.send("API 'Test' Request processed successfully");
});

export default app;