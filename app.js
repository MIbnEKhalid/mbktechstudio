import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import postRoutes from "./routes/post.js";
import minifyHTML from "express-minify-html";
import minify from "express-minify";
import compression from "compression";
import cors from "cors";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression());
app.use(minify());
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
app.use("/", express.static(path.join(__dirname, "public/")));
app.use('/static', express.static(path.join(__dirname, 'node_modules')));

// Set up views
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const domainRedirect = (req, res, next) => {
  let hostname = req.headers['x-forwarded-host'] || req.headers.host; // Allow overriding via x-forwarded-host
  
  console.log(`Incoming request to hostname: ${hostname}`);

  if (process.env.localenv === "true") {
    req.site = process.env.site;
  } else {
    req.site = {
      "mbktechstudio.com": "main",
      "docs.mbktechstudio.com": "docs",
      "project.mbktechstudio.com": "docs",
      "unilib.mbktechstudio.com": "unilib",
      "portfolio.mbktechstudio.com": "portfolio",
      "protfolio.mbktechstudio.com": "portfolio",
      "ibnekhalid.me": "portfolio",
      "privacy.mbktechstudio.com": "privacy",
      "api.mbktechstudio.com": "api",
    }[hostname] || "main";
  }

  console.log(`Request site set to: ${req.site}`);
  next();
};

// Routes
app.get("/", domainRedirect, (req, res) => {
  const siteViews = {
    docs: "mainPages/docDomain/index.ejs",
    unilib: "mainPages/uniDomain/index.ejs",
    portfolio: "mainPages/portfolioDomain/index.ejs",
    main: "mainPages/mainDomain/index.ejs",
    privacy: "mainPages/privacyDomain/index.ejs",
    api: "mainPages/apiDomain/index.ejs",
  };
  res.render(siteViews[req.site] || siteViews.main);
});

app.get("/history", domainRedirect, (req, res) => {
  if (req.site === "unilib") {
    return res.render("mainPages/uniDomain/unilibhistory.ejs");
  }
  res.render("mainPages/404.ejs");
});
 
const renderStaticRoutes = [
  { paths: ["/FAQS", "/FAQs", "/faqs", "/FrequentlyAskedQuestions"], view: "mainPages/mainDomain/FAQs.ejs" },
  { paths: ["/Terms&Conditions", "/PrivacyPolicy", "/privacypolicy", "/terms&conditions"], view: "mainPages/mainDomain/Terms&Conditions.ejs" },
  { paths: ["/Support&Contact", "/Support", "/Contact", "/Contact&Support"], view: "mainPages/mainDomain/Support&Contact.ejs" },
  { paths: ["/TrackTicket"], view: "mainPages/mainDomain/TrackTicket.ejs" },
  { paths: ["/Update"], view: "mainPages/mainDomain/update.ejs" },
];

renderStaticRoutes.forEach(({ paths, view }) => {
  app.get(paths, (req, res) => res.render(view));
});

// FAQs specific route
app.get(
  [
    "/FAQS/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/FAQs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/faqs/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
    "/FrequentlyAskedQuestions/What-Web-Tools-Do-You-Use-for-Website-hosting-Business-Email-etc",
  ],
  (req, res) => res.render("mainPages/mainDomain/otherPages/faqs1.ejs")
);

// Redirect routes
app.get(["/TrackTicket", "/Ticket", "/Track", "/trackticket"], (req, res) => {
  res.redirect("/TrackTicket");
});

// API and Post routes
app.use("/post", postRoutes);
app.use("/api", apiRoutes);

// 404 handler
app.use((req, res) => {
  console.log(`Path not found: ${req.url}`);
  res.render("mainPages/404.ejs");
});

// app.js
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export default app;
