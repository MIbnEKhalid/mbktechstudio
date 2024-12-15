async function getTermsVersionFromPrivacyPolicy() {
    try {
        console.log('Fetching terms version from privacy policy...');
        const response = await fetch('https://privacy.mbktechstudio.com/');
        const html = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let termsVersionElement = doc.getElementById('termVersionPrivacy');
        if (termsVersionElement) {
            const termsVersion = termsVersionElement.innerText.split(': ')[1];
            console.log('Fetched terms version:', termsVersion);
            return termsVersion;
        } else {
            throw new Error('Element with id "termVersionPrivacy" not found.');
        }
    } catch (err) {
        console.error('Failed to fetch or parse the privacy policy page:', err);
        return null;
    }
}

async function AskForCookieConsent() {
    try {
        console.log('Fetching cookie consent HTML...');
        const response = await fetch('https://mbktechstudio.com/Assets/cookie.html');
        const html = await response.text();
        document.getElementById('cookie').innerHTML = html;
        console.log('Cookie consent HTML loaded.');

        console.log('Getting terms version...');
        const termsVersion = await getTermsVersionFromPrivacyPolicy();
        console.log('Terms version obtained:', termsVersion);

        console.log('Checking cookie with terms version...');
        checkCookie(termsVersion);
    } catch (err) {
        console.error('Error in AskForCookieConsent:', err);
    }
}

async function SaveCookie() {
    try {
        console.log('Saving cookie...');
        const termsVersion = await getTermsVersionFromPrivacyPolicy();
        console.log('Terms version for saving cookie:', termsVersion);
        setCookie('agreed', termsVersion, 365);
        console.log('Cookie saved.');
        hideOverlay();
        console.log('Overlay hidden.');
    } catch (err) {
        console.error('Error in SaveCookie:', err);
    }
}

function checkCookie(currentVersion) {
    console.log('Checking cookie...');
    const agreedVersion = getCookie('agreed');
    console.log('Agreed version:', agreedVersion, 'Current version:', currentVersion);
    if (agreedVersion === currentVersion) {
        console.log('Cookie versions match. Hiding overlay.');
        hideOverlay();
    } else {
        console.log('Cookie versions do not match. Showing cookie notice.');
        document.getElementById('cookieNotice').style.display = 'block';
    }
}

function hideOverlay() {
    console.log('Hiding overlay...');
    document.getElementById('cookieNotice').style.display = 'none';
}

function setCookie(name, value, days) {
    console.log('Setting cookie:', name, value, days);

    // Determine expiration date
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }

    // Determine cookie domain
    let domain = "";
    if (window.location.hostname === "mbktechstudio.com") {
        domain = "; domain=.mbktechstudio.com"; // Allows access on both main domain and subdomains
    }

    // Construct and set cookie
    document.cookie = `${name}=${value || ""}${expires}; path=/${domain}`;
    console.log(`Cookie set with domain scope: ${domain || "current domain only"}`);
}


function getCookie(name) {
    console.log('Getting cookie:', name);
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            const value = cookie.substring(nameEQ.length, cookie.length);
            console.log('Cookie found:', value);
            return value;
        }
    }
    console.log('Cookie not found.');
    return null;
}

function hideCookieNotice() {
    console.log('Hiding cookie notice...');
    document.getElementById('cookieNotice').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {
    console.log('Document loaded. Asking for cookie consent...');
    AskForCookieConsent();
});