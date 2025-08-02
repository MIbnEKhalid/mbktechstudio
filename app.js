import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import postRoutes from "./routes/post.js";
import adminRoutes from "./routes/admin.js";
import minifyHTML from "express-minify-html";
import minify from "express-minify";
import compression from "compression";
import cors from "cors";
import { engine } from "express-handlebars";
import Handlebars from "handlebars";
import { generateSitemap } from './utils/sitemapGenerator.js';
import mbkauthe from 'mbkauthe';
import { validateSessionAndRole } from 'mbkauthe';

// Import security middleware
//import { securityHeaders, apiRateLimit, apiSecurityHeaders, requestLogger } from './middleware/security.js';
import { apiRateLimit, requestLogger } from './middleware/security.js';


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware (applied globally)
//app.use(securityHeaders);
app.use(requestLogger);
//app.use(apiSecurityHeaders);

// Rate limiting and speed control
app.use(apiRateLimit);
app.use(mbkauthe);

// Middleware
app.use(cors());
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

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});
Handlebars.registerHelper('encodeURIComponent', function (str) {
  return encodeURIComponent(str);
});
Handlebars.registerHelper('conditionalEnv', function (trueResult, falseResult) {
  console.log(`Checking conditionalEnv: ${process.env.localenv}`);
  return process.env.localenv ? trueResult : falseResult;
});
// Configure Handlebars
app.engine("handlebars", engine({
  defaultLayout: false,
  partialsDir: [
    path.join(__dirname, "views/templates"),
    path.join(__dirname, "node_modules/mbkauthe/views"),
    path.join(__dirname, "views/notice"),
    path.join(__dirname, "views")
  ], cache: process.env.localenv === "production"

}));
app.set("view engine", "handlebars");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "node_modules/mbkauthe/views")
]);

const domainRedirect = (req, res, next) => {
  let hostname = req.headers['x-forwarded-host'] || req.headers.host;
  hostname = hostname.replace(/:\d+$/, ''); // Remove port if present

  console.log(`Incoming request to hostname: http://${hostname}`);

  if (process.env.localenv === "true") {
    req.site = process.env.site;
  } else {
    req.site = {
      "mbktechstudio.com": "main",
      "www.mbktechstudio.com": "main",
      "docs.mbktechstudio.com": "docs",
      "project.mbktechstudio.com": "docs",
      "ibnekhalid.me": "main",
      "download.mbktechstudio.com": "download",
    }[hostname] || "main";
  }

  console.log(`Request site set to: ${req.site}`);
  next();
};

// Routes
app.get("/", domainRedirect, (req, res) => {
  const siteViews = {
    main: {
      view: "mainPages/mainDomain/index.handlebars",
      layout: "main",
    },
    docs: {
      view: "mainPages/otherDomain/docs.handlebars",
    },
    download: {
      view: "mainPages/otherDomain/download.handlebars",
      layout: "main",
      mainAppLink: process.env.PortalVersonControlJson
        ? JSON.parse(process.env.PortalVersonControlJson)
        : null,
    },
  };

  let viewEntry = siteViews[req.site] || siteViews.main;
  console.log(`Rendering view: ${JSON.stringify(viewEntry)}`);

  if (typeof viewEntry === "object") {
    const { view, ...locals } = viewEntry;
    res.render(view, locals);
  } else {
    res.render(viewEntry);
  }
});

app.get(["/FAQS", "/FAQs", "/faqs", "/FrequentlyAskedQuestions"], (req, res) => {
  res.render("mainPages/mainDomain/FAQs.handlebars", {
    layout: "main",
    title: "Frequently Asked Questions - MBK Tech Studio",
  });
});

// TrackTicket route with main layout
app.get(["/Support&Contact", "/Support", "/Contact", "/Contact&Support"], (req, res) => {
  res.render("mainPages/mainDomain/Support&Contact.handlebars", {
    layout: "main",
    title: "Support Ticket System - MBK Tech StudioSupport & Contact"
  });
});

// TrackTicket route with main layout
app.get(["/Terms&Conditions", "/PrivacyPolicy", "/privacypolicy", "/terms&conditions"], (req, res) => {
  res.render("mainPages/mainDomain/Terms&Conditions.handlebars", {
    layout: "main",
    title: "Terms & Conditions - MBK Tech Studio"
  });
});

// TrackTicket route with main layout
app.get(["/TrackTicket"], (req, res) => {
  res.render("mainPages/mainDomain/TrackTicket.handlebars", {
    layout: "main",
    title: "Support Ticket System - MBK Tech Studio"
  });
});

app.get(["/TrackTicket", "/Ticket", "/Track", "/trackticket"], (req, res) => {
  res.redirect("/TrackTicket");
});

// Admin panel route
app.get("/admin", validateSessionAndRole("SuperAdmin"), (req, res) => {
  res.render("mainPages/admin/index.handlebars", {
    layout: false, // No layout for admin panel
    title: "Admin Panel - Support Management",
    adminToken: process.env.ADMIN_SECRET_TOKEN || process.env.Main_SECRET_TOKEN || ''
  });
});

// API and Post routes
app.use("/post", postRoutes);
app.use("/api", apiRoutes);
app.use("/admin", validateSessionAndRole("SuperAdmin"), adminRoutes); // Use admin routes

// Spam protection routes
import { router as spamProtectionRouter } from './routes/admin/spamProtection.js';

// Add spam protection routes
app.use('/admin', spamProtectionRouter);


app.get('/sitemap.xml', domainRedirect, async (req, res) => {
  try {
    const domain = req.hostname;
    // Generate fresh sitemap for this domain, passing the site type for localhost
    const sitemap = await generateSitemap(domain, domain.includes('localhost') ? req.site : null);

    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// Individual sitemap view endpoint
app.get('/sitemap/:type', domainRedirect, async (req, res) => {
  try {
    const domain = req.hostname;
    const siteType = req.params.type;
    const sitemap = await generateSitemap(domain, siteType);

    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');
    res.send(sitemap);
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});


app.get('/robots.txt', domainRedirect, (req, res) => {
  const hostname = req.headers['x-forwarded-host'] || req.headers.host;
  const domain = hostname.replace(/:\d+$/, '');

  const robotsContent = `User-agent: *
Allow: /

Sitemap: https://${domain}/sitemap.xml`;
  res.type('text/plain');
  res.send(robotsContent);
});

// 404 handler
app.use((req, res) => {
  console.log(`Path not found: ${req.url}`);
  res.status(404).render("mainPages/404.handlebars", {
    layout: "main"
  });
});

// app.js
const PORT = process.env.PORT || 4133;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;