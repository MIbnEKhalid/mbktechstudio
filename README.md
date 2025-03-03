# MBK Tech Studio Website 

## Website URLs

### Portfolio Sites
- [ibnekhalid.me](https://ibnekhalid.me/)
- [portfolio.mbktechstudio.com](https://portfolio.mbktechstudio.com/)
- [protfolio.mbktechstudio.com](https://protfolio.mbktechstudio.com/) 
- [mbktechstudio.com](https://mbktechstudio.com/)
- [www.mbktechstudio.com](https://www.mbktechstudio.com/)(www redirect to main) 
- [unilib.mbktechstudio.com](https://unilib.mbktechstudio.com/)
- [privacy.mbktechstudio.com](https://privacy.mbktechstudio.com/)

### Source Code
- [GitHub Repository](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/)

Detailed Documentation of this website will be available soon on: [docs.mbktechstudio.com/mbktechstudio.com](https://docs.mbktechstudio.com/mbktechstudio.com)

![Deployment Status](https://readme.deploystatus.mbktechstudio.com/?platform=github&user=mibnekhalid&repo=MIbnEKhalid.github.io&background=333333&hide_border=false&border=ff0&width=200&height=50)

## Code FOrmattor
### .js JS-CSS-Html Formator
### .css JS-CSS-Html Formator
### .ejs EJS Beautify

## Database Structure

### Book Table

- `name` (text): The name of the book.
- `semester` (enum): The semester the book is used in. Possible values: `Semester1`, `Semester2`, `Semester3`, `Semester4`, `Semester5`, `Semester6`, `Semester7`, `Semester8`.
- `category` (enum): The category of the book. Possible values: `All`, `CourseBooks`, `LabManuals`, `Other`.
- `description` (text): A brief description of the book.
- `imageURL` (text): The URL of the book's image (e.g., `image.png`).
- `link` (text): A link to the book (e.g., Google Drive link).

Example:
```json
{
        "id": 0,
        "name": "Using Information Technology",
        "category": "CourseBooks",
        "description": "Brian K Williams & Stacey Sawyer",
        "imageURL": "UsingInformationTechnology.png",
        "link": "https://drive.google.com/file/d/15-2kf11bDvZDgIDmCNpvbJ6SzIQMTg2h/view?usp=sharing",
        "semester": "Semester1"
}
```

### Assignment & Quiz Table

- `subject` (text): The subject of the assignment or quiz.
- `description` (text): A brief description of the assignment or quiz.
- `issueDate` (text): The date the assignment or quiz was issued.
- `dueDate` (text): The due date for the assignment or quiz.

Example:
```json
{
        "id": 0,
        "issueDate": "01/03/2025",
        "dueDate": "01/03/2026",
        "subject": "Assignment",
        "description": "Test Assignment"
}
```

### Ticket Table

- `ticketno` (text): The ticket number.
- `name` (text): The name of the person who created the ticket.
- `title` (text): The title of the ticket.
- `status` (enum): The current status of the ticket. Possible values: `Pending`, `Open`, `Closed`, `Resolved`, `In Progress`.
- `createdDate` (text): The date and time the ticket was created.
- `lastUpdated` (text): The date and time the ticket was last updated.
- `auditTrail` (jsonb): A record of actions taken on the ticket.
        - `type` (text): The type of action (e.g., `status`, `update`).
        - `action` (text): A description of the action.
        - `timestamp` (text): The date and time the action occurred.

Example:
```json
{
        "id": 3,
        "name": "Name",
        "ticketno": "T000111333",
        "title": "Issue",
        "status": "Pending",
        "createdDate": "1:50:50 PM 25-02-2025",
        "lastUpdated": "1:50:50 PM 25-02-2025",
        "auditTrail": [
                {
                        "type": "status",
                        "action": "Ticket Created",
                        "timestamp": "2024-11-14T08:45:00Z"
                },
                {
                        "type": "status",
                        "action": "Status changed to 'In Progress'",
                        "timestamp": "2024-11-14T09:30:00Z"
                },
                {
                        "type": "update",
                        "action": "Network Issue Investigated",
                        "timestamp": "2024-11-14T10:00:00Z"
                },
                {
                        "type": "status",
                        "action": "Status changed to 'Resolved'",
                        "timestamp": "2024-11-15T10:00:00Z"
                }
        ]
}
```

## Hosting Architecture

This Node.js application is hosted on Vercel and handles multiple domains through a single instance. Here's how the domain routing is structured:

### Documentation Sites
- `docs.mbktechstudio.com`
- `project.mbktechstudio.com`
→ Served from `views/mainPages/docDomain/`

### Main Site
- `mbktechstudio.com` 
→ Served from `views/mainPages/mainDomain/`

### Portfolio Sites
- `portfolio.mbktechstudio.com`
- `protfolio.mbktechstudio.com`
- `ibnekhalid.me`
→ Served from `views/mainPages/portfolioDomain/`

### Privacy Policy
- `privacy.mbktechstudio.com`
→ Served from `views/mainPages/privacyDomain/`

### University Library
- `unilib.mbktechstudio.com`
→ Served from `views/mainPages/uniDomain/`

## Installation and Setup

1. Clone the repository:
```bash
git clone https://github.com/MIbnEKhalid/MIbnEKhalid.github.io.git
cd MIbnEKhalid.github.io
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the required environment variables:
```env
GMAIL_USER=username@gmail.com

GMAIL_PASS=your-app-password (not regular password)

DATABASE_URL=postgresql://username:password@server.domain/db_name

localenv=true

site=main

Main_SECRET_TOKEN=password

```

For detailed information about each environment variable, see the [`env.md`](env.md) file.

## Running the Application

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The application will be available at [`http://localhost:3000`](http://localhost:3000)

## Testing

### Production Test
First, start the application in production mode:
```bash
npm run start
```
This will set `process.env.localenv=false` and run the build.

### Run Tests
Then execute the test suite:
```bash
npm run test
```
The tests will validate API endpoints and page rendering functionality.

Note: Make sure all environment variables are properly configured before running tests.

## License

**Note:** Only The Source Code Of This Website Is Covered Under The **[MIT License](https://opensource.org/license/mit)**.  
The Project Documentation Covered Under The **[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/)** But Some **Images, Blog Posts, And Other Content Are NOT  
Covered Under This License And Remain The Intellectual Property Of The Author**.

See the [LICENSE](LICENSE) file for details.
 
## Contact

For questions or contributions, please contact Muhammad Bin Khalid at [mbktechstudio.com/Support](https://mbktechstudio.com/Support/?Project=MIbnEKhalidWeb), [support@mbktechstudio.com](mailto:support@mbktechstudio.com) or [chmuhammadbinkhalid28.com](mailto:chmuhammadbinkhalid28.com). 


## File Structure

```
Repo 
│   .env
│   .gitignore
│   app.js
│   env.md
│   jsconfig.json
│   LICENSE
│   package-lock.json
│   package.json
│   README.md
│   SECURITY.md
│   vercel.json
│
├───public
│   │   robots.txt
│   │   sitemap.xml
│   │
│   └───Assets
│       │   augh.mp3
│       │   docs.json
│       │   unilib.js
│       │
│       ├───Cookie
│       │       index.html
│       │
│       ├───FAQs
│       │       faq.json
│       │
│       ├───Images
│       │   │   background.png
│       │   │   cat.png
│       │   │   catfixing.png
│       │   │   catStacks.jpg
│       │   │   close-icon-white.svg
│       │   │   close-icon.svg
│       │   │   cookie-icon.svg
│       │   │   server.png
│       │   │   unity.png
│       │   │   user.png
│       │   │
│       │   ├───BookCovers
│       │   │       A-ZOHS.png
│       │   │       BookCover_Template.png
│       │   │       FundamentalsofPhysics9thEdition.png
│       │   │       ThomasCalculus11thEdition.png
│       │   │       UsingInformationTechnology.png
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
│       │           MBKSupportIcon.svg
│       │
│       ├───Scripts
│       │       config.js
│       │       cookie.js
│       │       form.support.js
│       │       header.js
│       │       social.js
│       │       Support.js
│       │       Ticket.js
│       │
│       ├───Style
│       │       404.css
│       │       cookie.css
│       │       doc.css
│       │       FAQs.css
│       │       main.css
│       │       style.css
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
│       api.js
│       pool.js
│       post.js
│
├───views
│   │   showMessage.ejs
│   │
│   ├───mainPages
│   │   │   404.ejs
│   │   │   domainNotRecognized.ejs
│   │   │
│   │   ├───docDomain
│   │   │       index.ejs
│   │   │
│   │   ├───mainDomain
│   │   │   │   FAQs.ejs
│   │   │   │   index.ejs
│   │   │   │   Support&Contact.ejs
│   │   │   │   Terms&Conditions.ejs
│   │   │   │   TrackTicket.ejs
│   │   │   │   update.ejs
│   │   │   │
│   │   │   └───otherPages
│   │   │           faqs1.ejs
│   │   │
│   │   ├───portfolioDomain
│   │   │       index.ejs
│   │   │
│   │   ├───privacyDomain
│   │   │       index.ejs
│   │   │
│   │   └───uniDomain
│   │           index.ejs
│   │           unilibhistory.ejs
│   │
│   └───templates
│           footer.ejs
│           footer1.ejs
│           header.ejs
│           sfooter.ejs
│
└───__test__
        api.test.js
        page.test.js

```


<!-- 
## Documentation License

The project documentation is available under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/). You may share and adapt the documentation for non-commercial purposes, as long as you give appropriate credit and distribute your contributions under the same license.

---

**Note:** Only The Source Code Of This Website Is Covered Under The MIT License.  
The Project Documentation Covered Under The Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License **But Some Images, Blog Posts, And Other Content Are NOT  
Covered Under This License And Remain The Intellectual Property Of The Author**.
-->