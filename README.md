# MBK Tech Studio Website

https://mbktechstudio.com/ or https://MIbnEKhalid.github.io/

**Deployed Branch: [main](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/main)**

**Active Test Branch: [test1](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/test1)**

Website Source Code / Copy of Website

https://github.com/MIbnEKhalid/mbktech.studios/

https://MIbnEKhalid.github.io.github.io/mbktech.studios/ or https://mbktechstudio.com/mbktech.studios/

## Hosting:
- The Website Is Hosted On GitHub, With A Custom Domain Purchased From [NameCheap](https://namecheap.com).
  *Note: If you are using a custom domain, ensure it is properly configured to point to your GitHub repository.* [How To Add A Custom Domain On Github Pages](#how-to-add-a-custom-domain-on-github-pages)
- Buying a domain is not necessary; you can use a GitHub domain for free, such as `user.github.io`.

## Directory Tree:

```
root
├───Assets/
│ ├───Images/
│ │ ├───about9.jpg
│ │ ├───background.png
│ │ ├───cat.png
│ │ ├───close-icon.svg
│ │ ├───cookie-icon.svg
│ │ ├───dg.svg
│ │ ├───dgicon.svg
│ │ ├───logo.png
│ ├───cookie.css
│ ├───cookie.html
│ ├───script.js
│ ├───style.css
├───Project/
│ ├───Img/
│ │ ├───download.svg
│ │ ├───CTMCpp.png
│ │ ├───cpp.png
│ ├───index.html
│ ├───style.css
├───UserAgreement/
│ ├───index.html
├───404.html
├───CNAME
├───index.html
├───README.md
```

*Note: To ensure clean and user-friendly URLs, HTML files are organized within directories named after their respective content, with each directory containing an `index.html` file. This approach facilitates clean URLs, enhancing readability and SEO performance.*

#### Example:

Instead of using `UserAgreement.html`:
- Bad URL: [https://mbktech.xyz/UserAgreement.html](https://mbktech.xyz/UserAgreement.html)

Use `UserAgreement/index.html`:
  - Good URL: [https://mbktech.xyz/UserAgreement/](https://mbktech.xyz/UserAgreement/)

## Functionality of Our Website:

- **On First Load, Agreement Prompt:**
  - Upon the initial loading of the website, users are prompted to agree with the terms of use.
  - Users cannot proceed to use the website until they accept the terms of use.

- **On Term Updates:**
  - When you change the terms and want to notify users about it, simply change the term version in `term.html`. When the version changes, all users will be prompted with the agreement box again until they save the cookie or accept the terms.
  - Users cannot proceed to use the website until they accept the terms of use.

- **Accepting Terms of Use:**
  - When a user agrees to the terms of use, the website saves a cookie with an expiry of 1 year.
  - This cookie serves as a marker that the user has agreed to the terms and can continue to access the website without being prompted again during this period.

- **Rejecting Terms of Use:**
  - If a user rejects the terms of use, the website loads a disagreement page.
  - After a few seconds, the website redirects the user to google.com.
  - This behavior implies that users who do not agree to the terms are redirected away from the website.

**Image References:**
When Website first time loads on device:
![Image 1 Description](Project/MBKTechStudio_SourceCode/termbox.png)
When Click on 'Terms Of Use & Privacy Policy' link:
![Image 2 Description](Project/MBKTechStudio_SourceCode/terms.png)
When Click On Disagree:
![Image 3 Description](Project/MBKTechStudio_SourceCode/disaagree.png)

In the root folder, we have the home page `root/index.html`, which is the main page of our website.


### How To Add A Custom Domain On Github Pages

## 1. Buy a Domain
- Purchase a domain from a domain registrar (e.g., Namecheap). Only the domain purchase is necessary; additional tools are not required.
- **Optional:** If you need a business email and have a low budget, you can use Zoho's free services to configure a business email for your custom domain.

## 2. Configure DNS Settings
- After purchasing your domain, go to the DNS settings or Advanced DNS settings of your domain registrar.

- Add the following CNAME Record:

    - **Type:** CNAME
    - **Host:** www
    - **Value:** `username.github.io.` (Replace `username` with your actual GitHub username)

- Add the following A Records:

    **Record 1:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.108.153

    **Record 2:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.109.153

    **Record 3:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.110.153

    **Record 4:**
    - **Type:** A
    - **Host:** @
    - **Value:** 185.199.111.153


## 3. GitHub Repository Settings
- Navigate to your `username.github.io` repository on GitHub.
- Go to the repository's **Settings**.
- Under **Code and Automation**, click on **Pages**.
- In the **Custom domain** field, enter your domain name (e.g., `example.com`) and click the **Save** button.
- Wait a few minutes for the domain to verify. Once verified, you will see the link change from `https://username.github.io/` to `http://example.com`.
- You will also see a `CNAME` file in your repository.

## 4. Enforce HTTPS
- In the same **Pages** section under **Custom domain**, check the **Enforce HTTPS** checkbox to ensure your site uses HTTPS.

## 5. Additional Notes
- If you create a repository named `<username>.github.io`, it will serve as the root of `https://<username>.github.io`. All other repository pages will be nested under this link. For example, a repository named `project1` would be accessible at `https://<username>.github.io/project1`.
- If you add a custom domain to `<username>.github.io`, all other repository pages will also be accessible under the new custom domain. For example, if your custom domain is `www.example.com`, the `project1` repository would be accessible at `https://www.example.com/project1`.
