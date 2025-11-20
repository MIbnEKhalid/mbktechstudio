import express from "express";
import dotenv from "dotenv";
import { pool } from "../routes/pool.js";
import { formRateLimit } from '../middleware/security.js';
import { validateSubmission } from './admin/spamProtection.js';

dotenv.config();

const app = express.Router();

function generateTicketNumber() {
    return 'T' + Math.floor(Math.random() * 1000000000);
}

app.post("/SubmitForm", formRateLimit, validateSubmission, async (req, res) => {
    console.log("Received request to /SubmitForm with body:", req.body);
    const allowedOrigin = "https://mbktech.org";
    const referer = req.headers.referer;

    // Determine if the environment is local
    const isLocalEnv = process.env.localenv === "true" || process.env.NODE_ENV === "development";

    // For testing, allow submissions without referer check in local environment
    if (!isLocalEnv) {
        // Validate referer only in production
        if (
            !referer ||
            (!referer.includes(allowedOrigin) &&
                !referer.includes(".mbktech.org") &&
                !referer.includes("http://localhost:3000"))
        ) {
            console.log("Invalid referer:", referer);
            return res.status(403).json({ error: "Forbidden. Invalid referer." });
        }
    }

    console.log("Received request to /SubmitForm");

    const {
        UserName: name,
        Email: email,
        Subject: subject,
        Message: message,
        PageUrl,
        Timestamp,
        support,
        projectCato,
        blogCato,
        Number: phoneNumber,
        stars: rating,
        ...additionalFields
    } = req.body;

    // Validate required fields
    const missingFields = ["UserName", "Email", "Subject", "Message"].filter(
        (field) => !req.body[field]
    );

    if (missingFields.length > 0) {
        console.log("Missing required fields:", missingFields);
        return res.status(400).json({
            error: "Invalid request. Missing required fields.",
            missingFields,
        });
    }

    let ticketNumber = null;

    // Generate ticket number for support requests
    if (subject === "Support") {
        ticketNumber = generateTicketNumber();

        // Ensure ticket number is unique in new table
        let isUnique = false;
        while (!isUnique) {
            try {
                const checkQuery = "SELECT id FROM support_submissions WHERE ticket_number = $1";
                const checkResult = await pool.query(checkQuery, [ticketNumber]);
                if (checkResult.rows.length === 0) {
                    isUnique = true;
                } else {
                    ticketNumber = generateTicketNumber();
                }
            } catch (err) {
                console.error("Error checking ticket uniqueness:", err);
                break;
            }
        }
    }

    // Create audit trail entry
    const auditTrail = [{
        type: "status",
        action: "Submission Created",
        timestamp: new Date().toISOString(),
        by: "system"
    }];

    try {
        // Insert into new support_submissions table
        const insertQuery = `
            INSERT INTO support_submissions (
                ticket_number, subject, support_type, project_category, blog_category,
                name, email, phone_number, message, rating, status, priority,
                page_url, audit_trail, additional_fields
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
            RETURNING id, ticket_number
        `;

        const values = [
            ticketNumber,
            subject,
            support || null,
            projectCato || null,
            blogCato || null,
            name,
            email,
            phoneNumber || null,
            message,
            rating ? parseInt(rating) : null,
            'pending',
            'normal', // default priority
            PageUrl || null,
            JSON.stringify(auditTrail),
            JSON.stringify(additionalFields)
        ];

        const result = await pool.query(insertQuery, values);
        const submissionId = result.rows[0].id;

        console.log("Submission saved to database:", {
            id: submissionId,
            ticketNumber: ticketNumber,
            subject: subject,
            name: name,
            email: email
        });

        // Also save to old Ticket table for backward compatibility if it's a support request
        if (subject === "Support" && ticketNumber) {
            try {
                const ticketData = {
                    ticketno: ticketNumber,
                    name,
                    title: subject + ' / ' + support + ' / ' + projectCato,
                    status: "Pending",
                    createdDate: new Date().toISOString(),
                    lastUpdated: new Date().toISOString(),
                    auditTrail: [
                        {
                            type: "status",
                            action: "Ticket Created",
                            timestamp: new Date().toISOString(),
                        },
                    ],
                };

                const legacyQuery = `
                INSERT INTO "Ticket" (ticketno, name, title, status, "createdDate", "lastUpdated", "auditTrail")
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *;
                `;
                const legacyValues = [
                    ticketData.ticketno,
                    ticketData.name,
                    ticketData.title,
                    ticketData.status,
                    ticketData.createdDate,
                    ticketData.lastUpdated,
                    JSON.stringify(ticketData.auditTrail),
                ];

                await pool.query(legacyQuery, legacyValues);
                console.log("Legacy ticket entry created for backward compatibility");
            } catch (err) {
                console.error("Error adding legacy ticket (non-critical):", err);
            }
        }

        // Send response based on submission type
        if (ticketNumber) {
            res.status(200).json({
                message: "Support request submitted successfully",
                ticketNumber: ticketNumber,
                submissionId: submissionId,
                status: "pending"
            });
        } else {
            res.status(200).json({
                message: "Submission received successfully",
                submissionId: submissionId,
                status: "pending"
            });
        }

    } catch (error) {
        console.error("Failed to save submission:", error);
        res.status(500).json({
            error: "Failed to save submission",
            details: error.message
        });
    }
});

export default app;