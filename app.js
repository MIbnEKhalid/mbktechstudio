import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import postRoutes from "./routes/post.js";
import minifyHTML from "express-minify-html";
import minify from "express-minify";
import compression from "compression";
import cors from "cors";
import { engine } from "express-handlebars";
import Handlebars from "handlebars"; 
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

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});
Handlebars.registerHelper('encodeURIComponent', function (str) {
  return encodeURIComponent(str);
});
// Configure Handlebars
app.engine("handlebars", engine({
  defaultLayout: false,
  partialsDir: [
    path.join(__dirname, "views/templates"),
    path.join(__dirname, "views/notice"),
    path.join(__dirname, "views")
  ],  cache: false // Disable cache for development

}));
app.set("view engine", "handlebars");
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
      "portalapp.mbktechstudio.com": "portalapp",
      "download.portal.mbktechstudio.com": "downloadportalapp",
      "download.mbktechstudio.com": "downloadportalapp",
    }[hostname] || "main";
  }

  console.log(`Request site set to: ${req.site}`);
  next();
};

// Routes
app.get("/", domainRedirect, (req, res) => {
  const siteViews = {
    docs: "mainPages/docDomain/index",
    unilib: "mainPages/uniDomain/index",
    portfolio: "mainPages/portfolioDomain/index",
    main: "mainPages/mainDomain/index",
    privacy: "mainPages/privacyDomain/index",
    api: "mainPages/apiDomain/index",
    portalapp: "mainPages/portalappDomain/index",
    downloadportalapp: "mainPages/portalappDomain/download",
  };
  console.log(`Rendering view: ${siteViews[req.site] || siteViews.main}`);
  res.render(siteViews[req.site] || siteViews.main);
});

app.get("/history", domainRedirect, (req, res) => {
  if (req.site === "unilib") {
    return res.render("mainPages/uniDomain/unilibhistory");
  }
  res.render("mainPages/404");
});


 
const renderStaticRoutes = [
  { paths: ["/FAQS", "/FAQs", "/faqs", "/FrequentlyAskedQuestions"], view: "mainPages/mainDomain/FAQs" },
  { paths: ["/Terms&Conditions", "/PrivacyPolicy", "/privacypolicy", "/terms&conditions"], view: "mainPages/mainDomain/Terms&Conditions" },
  { paths: ["/Support&Contact", "/Support", "/Contact", "/Contact&Support"], view: "mainPages/mainDomain/Support&Contact" },
  { paths: ["/TrackTicket"], view: "mainPages/mainDomain/TrackTicket" },
  { paths: ["/Update"], view: "mainPages/mainDomain/update" },
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
  (req, res) => res.render("mainPages/mainDomain/otherPages/faqs1")
);

// Redirect routes
app.get(["/TrackTicket", "/Ticket", "/Track", "/trackticket"], (req, res) => {
  res.redirect("/TrackTicket");
});

// API and Post routes
app.use("/post", postRoutes);
app.use("/api", apiRoutes);

app.get(["/api*","/post*"], (req, res) => {
  res.render("mainPages/apiDomain/notfound");
});

// 404 handler
app.use((req, res) => {
  console.log(`Path not found: ${req.url}`);
  res.render("mainPages/404");
});

// app.js
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
export default app;
