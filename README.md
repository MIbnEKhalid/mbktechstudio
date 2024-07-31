# MBK Tech Studio Website

https://mbktechstudio.com/ or https://MIbnEKhalid.github.io/

## Deployed Branch: [main](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/main) 
## Active Test Branch: [test1](https://github.com/MIbnEKhalid/MIbnEKhalid.github.io/tree/test1)

Website Source Code / Copy of Website

https://github.com/MIbnEKhalid/mbktech.studios/

https://MIbnEKhalid.github.io.github.io/mbktech.studios/ or https://mbktechstudio.com/mbktech.studios/

## Hosting:
- The Website Is Hosted On GitHub, With A Custom Domain Purchased From [NameCheap](https://namecheap.com).
  *Note: If you are using a custom domain, ensure it is properly configured to point to your GitHub repository.* [How To Add A Custom Domain On Github Pages](#customDomain)
- Buying domain is not necessary you can use github domain for free *user.github.io*.

## Directory Tree:

```
root
├───Assets/
│   ├───Images/
│   │   ├───about9.jpg
│   │   ├───background.png
│   │   ├───cat.png
│   │   ├───close-icon.svg
│   │   ├───cookie-icon.svg
│   │   ├───dg.svg
│   │   ├───dgicon.svg
│   │   ├───logo.png
│   ├───cookie.css
│   ├───cookie.html
│   ├───script.js
│   ├───style.css
├───Project/
│   ├───Img/
│   │   ├───download.svg
│   │   ├───CTMCpp.png
│   │   ├───cpp.png
│   ├───index.html
│   ├───style.css
├───UserAgreement/
│   ├───index.html
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
  - When You Change Terms and want to notify user about it, simplply change term version in term.html. When version change all user will be prompt agreement box again until they save cookie again or accept terms
  - Users cannot proceed to use the website until they accept the terms of use.

- **Accepting Terms of Use:**
  - When a user agrees to the terms of use, the website saves a cookie with an expiry of 1 year.
  - This cookie likely serves as a marker that the user has agreed to the terms and can continue to access the website without being prompted again during this period.

- **Rejecting Terms of Use:**
  - If a user rejects the terms of use, the website loads a disagreement page.
  - After a few seconds, the website redirects the user to google.com.
  - This behavior implies that users who do not agree to the terms are redirected away from the website.


**Image References:**
When Website first time laod on device.
![Image 1 Description](Project/MBKTechStudio_SourceCode/termbox.png)
When Clcik on 'Terms Of Use & Privacy Policy' link.
![Image 2 Description](Project/MBKTechStudio_SourceCode/terms.png)
When Click On Disagree
![Image 3 Description](Project/MBKTechStudio_SourceCode/disaagree.png)


In the root folder, we have the home page `root/index.html` which is main page of our website.



#### How To Add A Custom Domain On Github Pages &nbsp;[<sup>[TOC]</sup>](#customDomain)

- If you create a repository named <username>.github.io, it will serve as the root of https://<username>.github.io. All other repository pages will be nested under this link. For example, a repository named project1 would be accessible at https://<username>.github.io/project1.

- Additionally, if you add a custom domain to <username>.github.io, all other repository pages will also be accessible under the new custom domain. For example, if your custom domain is www.example.com, the project1 repository would be accessible at https://www.example.com/project1.
