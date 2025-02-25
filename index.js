import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import postRoutes from "./routes/post.js";
import minifyHTML from "express-minify-html";
import minify from "express-minify";
import compression from "compression";
import cors from "cors"; // Import the cors package

const app = express();
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); // To parse JSON request bodies
// Enable compression and minification
app.use(compression());
app.use(minify());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  minifyHTML({
    override: true,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      removeAttributeQuotes: true,
      minifyCSS: true,
      minifyJS: true,
    },
  })
);

// Serve static files
app.use("/", express.static(path.join(__dirname, "public/")));

app.get("/", (req, res) => {
  return res.render("mainPages/index.ejs");
});

app.get(
  ["/FAQS", "/FAQs", "/faqs", "/FrequentlyAskedQuestions"],
  (req, res) => {
    return res.render("mainPages/FAQs.ejs");
  }
);
app.get(
  [
    "/FAQS/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/FAQs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/faqs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/FrequentlyAskedQuestions/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
  ],
  (req, res) => {
    return res.render("otherPages/faqs1.ejs");
  }
);

app.get(
  [
    "/Terms&Conditions",
    "/PrivacyPolicy",
    "/privacypolicy",
    "/terms&conditions",
  ],
  (req, res) => {
    return res.render("mainPages/Terms&Conditions.ejs");
  }
);

app.use("/post", postRoutes);

app.use("/api", apiRoutes);

app.get(
  ["/Support&Contact", "/Support", "/Contact", "/Contact&Support"],
  (req, res) => {
    return res.render("mainPages/Support&Contact.ejs");
  }
);

app.use((req, res) => {
  console.log(`Path not found: ${req.url}`);
  return res.render("mainPages/404.ejs");
});

const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
