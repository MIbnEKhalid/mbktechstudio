async function getTermsVersionFromPrivacyPolicy() {
    try {
        const response = await fetch('https://privacy.mbktechstudio.com/');
        const html = await response.text();
        let parser = new DOMParser();
        let doc = parser.parseFromString(html, 'text/html');
        let termsVersionElement = doc.getElementById('termVersionPrivacy');
        if (termsVersionElement) {
            return termsVersionElement.innerText.split(': ')[1];
            console.log(termsVersionElement.innerText.split(': ')[1]);
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
        const response = await fetch('https://mbktechstudio.com/Assets/cookie.html');
        const html = await response.text();
        document.getElementById('cookie').innerHTML = html;
        console.log("s1");
        // Await the result of getTermsVersionFromPrivacyPolicy
        const termsVersion = await getTermsVersionFromPrivacyPolicy();
        console.log(termsVersion);
        // Check the cookie with the retrieved terms version
        checkCookie(termsVersion);
    } catch (err) {
        console.error('Error in AskForCookieConsent:', err);
    }
}

async function SaveCookie() {
    try {
        console.log('Save Cookie: 1');
        const termsVersion = await getTermsVersionFromPrivacyPolicy();
        console.log('Save Cookie: 2', termsVersion);
        setCookie('agreed', termsVersion, 365);
        console.log('Save Cookie: 3');
        hideOverlay();
        console.log('Save Cookie: 4');
    } catch (err) {
        console.error('Error in SaveCookie:', err);
    }
}

function checkCookie(currentVersion) {
    const agreedVersion = getCookie('agreed');
    if (agreedVersion === currentVersion) {
        hideOverlay();
    } else {
        document.getElementById('cookieNotice').style.display = 'block';
    }
}

function hideOverlay() {
    document.getElementById('cookieNotice').style.display = 'none';
}

function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    var domain = "; domain=.mbktechstudio.com";
    document.cookie = name + "=" + (value || "") + expires + "; path=/" + domain;
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

function hideCookieNotice() {
    document.getElementById('cookieNotice').style.display = 'none';
}

document.addEventListener("DOMContentLoaded", function () {
    AskForCookieConsent();
});