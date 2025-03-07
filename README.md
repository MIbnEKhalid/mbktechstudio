# MBK Tech Studio Website 
<img height=48px src="https://img.icons8.com/?size=48&id=Pxe6MGswB8pX&format=png"/>   <img src="https://skillicons.dev/icons?i=html,css,js,nodejs,vercel,postgres"/>  <img height=48px src="https://console.neon.tech/favicon/favicon.svg"/>  

Welcome to the MBK Tech Studio Website repository. This repository contains the source code and documentation for the MBK Tech Studio website, which showcases the portfolio, projects, and services offered by Muhammad Bin Khalid. The website is built using Node.js and is hosted on Vercel, providing a seamless and efficient platform for managing multiple domains and delivering content to users.

The repository includes detailed information about the website's structure, database schema, hosting architecture, and setup instructions. It also provides examples of the data models used for books, assignments, quizzes, and tickets, ensuring a comprehensive understanding of the project's backend.

Feel free to explore the code, contribute to the project, or reach out for support through the provided contact information.

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
###  EJS Beautify

## Database Structure

See [`db.md`](documentation/db.md) for detailed information on the project database models, structure, and related documentation.

## Project File Structure

See [`file.md`](documentation/file.md) for detailed information on the project file structure.

## Hosting Architecture

This Node.js application is hosted on Vercel and handles multiple domains through a single instance. Here's how the domain routing is structured:

### Main Site
- `mbktechstudio.com` 
→ Served from `views/mainPages/mainDomain/`

### Documentation Sites
- `docs.mbktechstudio.com`
- `project.mbktechstudio.com`
→ Served from `views/mainPages/docDomain/`

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

### Api Documentation
- `api.mbktechstudio.com`
→ Served from `views/mainPages/apiDomain/`

### Download Apps
- `download.portal.mbktechstudio.com`
- `download.mbktechstudio.com`
→ Served from `views/mainPages/portalappDomain/`

### Download Apps 
- `portalapp.mbktechstudio.com`
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

For questions or contributions, please contact Muhammad Bin Khalid at [mbktechstudio.com/Support](https://mbktechstudio.com/Support/?Project=MIbnEKhalidWeb), [support@mbktechstudio.com](mailto:support@mbktechstudio.com) or [chmuhammadbinkhalid28.com](mailto:chmuhammadbinkhalid28.com). 





<!-- 
## Documentation License

The project documentation is available under the [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-nc-sa/4.0/). You may share and adapt the documentation for non-commercial purposes, as long as you give appropriate credit and distribute your contributions under the same license.

---

**Note:** Only The Source Code Of This Website Is Covered Under The MIT License.  
The Project Documentation Covered Under The Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License **But Some Images, Blog Posts, And Other Content Are NOT  
Covered Under This License And Remain The Intellectual Property Of The Author**.
-->