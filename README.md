# MBKTech.org Website 
<img height=48px src="https://handlebarsjs.com/images/handlebars_logo.png"/>   <img src="https://skillicons.dev/icons?i=html,css,js,nodejs,vercel,postgres"/>  <img height=48px src="https://console.neon.tech/favicon/favicon.svg"/>  

Welcome to the MBK Tech Website repository. This repository contains the source code and documentation for the MBK Tech website, which showcases the portfolio, projects, and services offered by Muhammad Bin Khalid. The website is built using Node.js and is hosted on Vercel, providing a seamless and efficient platform for managing multiple domains and delivering content to users.

The repository includes detailed information about the website's structure, database schema, hosting architecture, and setup instructions. It also provides examples of the data models used for books, assignments, quizzes, and tickets, ensuring a comprehensive understanding of the project's backend.

Feel free to explore the code, contribute to the project, or reach out for support through the provided contact information.

## Website URLs
### Redirect

The `index.html` file in the root directory is configured to redirect `mibnekhalid.github.io` to `mbktech.org`.

### Sites
- [mbktech.org](https://mbktech.org/)
- [www.mbktech.org](https://www.mbktech.org/)(www redirect to main) 
- [unilib.mbktech.org](https://unilib.mbktech.org/)
- [privacy.mbktech.org](/PrivacyPolicy)

### Source Code
- [GitHub Repository](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/)

Detailed Documentation of this website will be available soon on: [docs.mbktech.org/mbktech.org](https://docs.mbktech.org/mbktech.org)

![Deployment Status](https://readme.deploystatus.mbktech.org/?platform=github&user=mibnekhalid&repo=MIbnEKhalid.github.io&background=333333&hide_border=false&border=ff0&width=200&height=50) 

## Database Structure

See [`db.md`](documentation/db.md) for detailed information on the project database models, structure, and related documentation.

## Project File Structure

See [`file.md`](documentation/file.md) for detailed information on the project file structure.

## Hosting Architecture

This Node.js application is hosted on Vercel and handles multiple domains through a single instance. Here's how the domain routing is structured:

### Main Site
- `mbktech.org` 
→ Served from `views/mainPages/mainDomain/`

### Documentation Sites
- `docs.mbktech.org`
- `project.mbktech.org`
→ Served from `views/mainPages/docDomain/`

### Privacy Policy
- `privacy.mbktech.org`
→ Served from `views/mainPages/privacyDomain/`

### University Library
- `unilib.mbktech.org`
→ Served from `views/mainPages/uniDomain/`

### Api Documentation
- `api.mbktech.org`
→ Served from `views/mainPages/apiDomain/`

### Download Apps
- `download.portal.mbktech.org`
- `download.mbktech.org`
→ Served from `views/mainPages/portalappDomain/`

### Download Apps 
- `portalapp.mbktech.org`
→ Served from `views/mainPages/portalappDomain/`



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

For detailed information about each environment variable, see the [`env.md`](documentation/env.md) file.

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

For questions or contributions, please contact Muhammad Bin Khalid at [mbktech.org/Support](https://mbktech.org/Support/?Project=MIbnEKhalidWeb), [support@mbktech.org](mailto:support@mbktech.org) or [chmuhammadbinkhalid28.com](mailto:chmuhammadbinkhalid28.com). 

**Developed by [Muhammad Bin Khalid](https://github.com/MIbnEKhalid)**




<!-- 
## Documentation License

The project documentation is available under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/). You may share and adapt the documentation for non-commercial purposes, as long as you give appropriate credit and distribute your contributions under the same license.

---

**Note:** Only The Source Code Of This Website Is Covered Under The MIT License.  
The Project Documentation Covered Under The Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License **But Some Images, Blog Posts, And Other Content Are NOT  
Covered Under This License And Remain The Intellectual Property Of The Author**.
-->