# File Structure
Files 59, Folders 24

tree /F

(Get-ChildItem -Recurse -File | Measure-Object).Count

(Get-ChildItem -Recurse -Directory | Measure-Object).Count
```
Repo
│   .env
│   .gitignore
│   app.js
│   index.html
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
│   └───Assets
│       │   docs.json
│       │   setup.sh
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
│       │           dg.svg
│       │           dgicon.svg
│       │           logo.png
│       │           M-Dev.png
│       │           MBKSupportIcon.svg
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
│       admin.js
│       api.js
│       pool.js
│       post.js
│
├───utils
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
        │       FAQs.handlebars
        │       index.handlebars
        │       Support&Contact.handlebars
        │       Terms&Conditions.handlebars
        │       TrackTicket.handlebars
        │
        └───otherDomain
                docs.handlebars
                download.handlebars
```