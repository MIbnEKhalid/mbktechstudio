# File Structure
Files 65, Folders 26

tree /F

(Get-ChildItem -Recurse -File | Measure-Object).Count

(Get-ChildItem -Recurse -Directory | Measure-Object).Count
```
Repo
│   .env
│   .env.example
│   .gitignore
│   app.js
│   LICENSE
│   package.json
│   README.md
│   SECURITY.md
│   vercel.json
│
├───.github
│   └───workflows
│           codeql.yml
│
├───database
│       001_create_support_submissions.sql
│
├───documentation
│       db.md
│       env.md
│       file.md
│
├───middleware
│       security.js
│
├───public
│   │   logo.png
│   │   M.png
│   │   robots.txt
│   │
│   ├───.well-known
│   │       security.txt
│   │
│   └───Assets
│       │   docs.json
│       │
│       ├───Cookie
│       │       index.html
│       │
│       ├───FAQs
│       │       faq.json
│       │
│       ├───Images
│       │   │   background.png
│       │   │   close-icon-white.svg
│       │   │   close-icon.svg
│       │   │   cookie-icon.svg
│       │   │
│       │   ├───Docs
│       │   │       cpp.png
│       │   │       CTMCpp.png
│       │   │       mainpage.png
│       │   │       unity.png
│       │   │
│       │   └───Icon
│       │           logo.png
│       │           M-Dev.png
│       │           M.png
│       │
│       ├───Scripts
│       │       cookie.js
│       │       form.support.js
│       │       Support.js
│       │       Ticket.js
│       │
│       ├───Style
│       │       cookie.css
│       │       FAQs.css
│       │       main.css
│       │       Supportstyle.css
│       │       Ticket.css
│       │
│       ├───Support
│       │       projects.json
│       │
│       └───Tickett
│               ticketS.PNG
│               ticketT.PNG
│
├───routes
│   │   admin.js
│   │   api.js
│   │   pool.js
│   │   post.js
│   │
│   └───admin
│           spamProtection.js
│
├───utils
│       icon.js
│       sitemapGenerator.js
│
└───views
    ├───layouts
    │       main.handlebars
    │
    └───mainPages
        │   404.handlebars
        │
        ├───admin
        │       index.handlebars
        │
        ├───mainDomain
        │       AdvancedPackage.handlebars
        │       BasicPackage.handlebars
        │       FAQs.handlebars
        │       index.handlebars
        │       services.handlebars
        │       Support&Contact.handlebars
        │       Terms&Conditions.handlebars
        │       TrackTicket.handlebars
        │
        └───otherDomain
                docs.handlebars
                download.handlebars
```