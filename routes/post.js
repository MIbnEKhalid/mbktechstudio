import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
 dotenv.config();

const app = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Adjust the service as needed
  auth: {
    user: process.env.GMAIL_USER, // Your email
    pass: process.env.GMAIL_PASS, // Your email password
  },
});

app.post("/SubmitForm",  async (req, res) => {
    const allowedOrigin = "https://mbktechstudio.com";
    const referer = req.headers.referer;
  
    // Determine if the environment is local
    const isLocalEnv = process.env.localenv === "true";
  
    // Validate referer
    if (
      !referer ||
      (!referer.includes(allowedOrigin) &&
        !referer.includes(".mbktechstudio.com") &&
        !(isLocalEnv && referer.includes("http://localhost:3000")))
    ) {
      console.log("Invalid referer:", referer);
      return res.status(403).json({ error: "Forbidden. Invalid referer." });
    }

  console.log("Received request to /SubmitForm with body:", req.body);

  const {
    UserName: name,
    Email: email,
    Subject: subject,
    Message: message,
    PageUrl,
    Timestamp,
    support,
    projectCato,
    ...additionalFields
  } = req.body;

  // Validate required fields
  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!subject) missingFields.push("subject");
  if (!message) missingFields.push("message");

  if (missingFields.length > 0) {
    console.log("Missing required fields:", missingFields);
    return res.status(400).json({
      error: "Invalid request. Missing required fields.",
      missingFields,
    });
  }

  // Generate table rows for additional fields
  const generateTableRow = (label, value, isHighlighted = false) => `
        <tr style="${isHighlighted ? "background-color: #f9f9f9;" : ""}">
            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${label}</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${
              value || "N/A"
            }</td>
        </tr>
    `;

  // Construct the email table
  const emailContent = `
          ${generateTableRow(
            "Page URL",
            `<a href="${PageUrl}" style="color: #007BFF; text-decoration: none;">${PageUrl}</a>`
          )}
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; padding: 20px; background-color: #f9f9f9;">
    <h2 style="text-align: center; background-color: #d1ecf1; padding: 15px; border-radius: 6px; color: #0c5460;">
        Contact Form Submission
    </h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        ${generateTableRow("Subject", subject, true)}
        ${support ? generateTableRow("Support", support) : ""}
        ${
          projectCato
            ? generateTableRow("Project Category", projectCato, true)
            : ""
        }
        ${generateTableRow("Name", name)}
        ${generateTableRow(
          "Email",
          `<a href="mailto:${email}" style="color: #007BFF;">${email}</a>`,
          true
        )}
        ${generateTableRow("Message", message)}
        ${generateTableRow("Timestamp", Timestamp, true)}

    </table>
    ${
      Object.keys(additionalFields).length
        ? `
            <h3 style="margin-top: 30px; color: #555; font-size: 18px; border-top: 1px solid #ddd; padding-top: 10px;">
                Additional Information
            </h3>
            <table style="width: 100%; border-collapse: collapse;">
                ${Object.entries(additionalFields)
                  .map(([key, value]) => generateTableRow(key, value))
                  .join("")}
            </table>
            `
        : ""
    }
    <p style="margin-top: 20px; font-size: 0.9em; color: #555; text-align: center;">
        This message was sent from the contact form on your website.
    </p>
</div>

    `;

  try {
    // Send the email
    const mailOptions = {
      from: `<${email}>`,
      to: "support@mbktechstudio.com",
      subject: "New message from contact form",
      html: emailContent,
    };

    console.log("Sending email with options:", mailOptions);
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info);

    res.status(200).json({ message: "Email sent successfully", info });
  } catch (error) {
    console.error("Failed to send email:", error);
    res
      .status(500)
      .json({ error: "Failed to send email", details: error.message });
  }
});

export default app;
