import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import multer from "multer";
dotenv.config();

const app = express.Router();
const upload = multer(); // Multer to parse form-data

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail", // Adjust the service as needed
    auth: {
        user: process.env.GMAIL_USER, // Your email
        pass: process.env.GMAIL_PASS, // Your email password
    },
});

app.post("/sendmail", upload.none(), async (req, res) => {
    // Extract fields from req.body with fallback mappings
    const {
        UserName: name = req.body.name,
        Email: email = req.body.email,
        Subject: subject = req.body.subject,
        Message: message = req.body.message,
        Timestamp,
        PageUrl,
    } = req.body;

    console.log("Received request to send email with the following data:", req.body);

    // Validate form data and log missing fields
    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!email) missingFields.push("email");
    if (!subject) missingFields.push("subject");
    if (!message) missingFields.push("message");

    if (missingFields.length > 0) {
        console.log("Validation failed: Missing required fields:", missingFields.join(", "));
        return res.status(400).json({
            error: "Invalid request. Missing required fields.",
            missingFields: missingFields,
        });
    }

    try {
        // Compose email
        const mailOptions = {
            from: `${name} <${email}>`,
            to: "support@mbktechstudio.com",
            subject: "New message from contact form",
            text: `
    Subject: ${subject}
    Name: ${name}
    Email: ${email}
    Message: ${message}
    Timestamp: ${Timestamp}
    Page URL: ${PageUrl}
                `,
            html: `
                    <p><strong>Subject:</strong> ${subject}</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong> ${message}</p>
                    <p><strong>Timestamp:</strong> ${Timestamp}</p>
                    <p><strong>Page URL:</strong> <a href="${PageUrl}">${PageUrl}</a></p>
                `,
        };

        console.log("Sending email with the following options:", mailOptions);

        // Send email
        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent successfully:", info);

        res.status(200).json({ message: "Email sent successfully", info });
    } catch (error) {
        console.error("Error sending email:", error.message);
        res.status(500).json({ error: "Failed to send email", details: error.message });
    }
});



export default app;
