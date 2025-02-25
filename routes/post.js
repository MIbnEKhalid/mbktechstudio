import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getFirestore, doc, setDoc } from "firebase/firestore";

dotenv.config();

const app = express.Router();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);
const appp = initializeApp(firebaseConfig);

// Initialize analytics only if supported (i.e. in a browser context)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(appp);
  }
});

const db = getFirestore(appp);

// Test connection to Firestore
const testConnection = async () => {
  try {
    const testDocRef = doc(db, "testCollection", "testConnection");
    await setDoc(testDocRef, {
      timestamp: new Date().toISOString(),
      message: "Connection successful",
    });
    console.log("Successfully connected to Firestore");
  } catch (error) {
    console.error("Failed to connect to Firestore:", error);
  }
};

testConnection();  

// Update the /test endpoint
app.post("/test", async (req, res) => {
  const {   title, name, createdDate, lastUpdated, status, auditTrail } = req.body;

  const id = "yourCollectionName"; 
  try {
    // Write data to Firestore
    const docRef = doc(db, "yourCollectionName", id);
    await setDoc(docRef, {
      title,
      name,
      createdDate,
      lastUpdated,
      status,
      auditTrail,
    });

    res.status(200).json({ message: "Record added successfully" });
  } catch (error) {
    console.error("Failed to add record to Firestore:", error);
    res.status(500).json({ error: "Failed to add record", details: error.message });
  }
});


// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Adjust the service as needed
  auth: {
    user: process.env.GMAIL_USER, // Your email
    pass: process.env.GMAIL_PASS, // Your email password
  },
});

const generateTableRow = (label, value, isHighlighted = false) => `
  <tr style="${isHighlighted ? "background-color: #f9f9f9;" : ""}">
    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${label}</td>
    <td style="padding: 10px; border: 1px solid #ddd;">${value || "N/A"}</td>
  </tr>
`;

const constructEmailContent = (data) => {
  const {
    PageUrl,
    subject,
    support,
    projectCato,
    name,
    email,
    message,
    Timestamp,
    additionalFields,
  } = data;

  return `
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
};

app.post("/SubmitForm", async (req, res) => {
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

  const emailContent = constructEmailContent({
    PageUrl,
    subject,
    support,
    projectCato,
    name,
    email,
    message,
    Timestamp,
    additionalFields,
  });

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
