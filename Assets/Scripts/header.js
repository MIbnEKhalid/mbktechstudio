// Sticky Navigation Menu JS Code
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");

if (nav && scrollBtn) {
    console.log(scrollBtn);
    let val;
    window.onscroll = function() {
        if (document.documentElement.scrollTop > 20) {
            nav.classList.add("sticky");
            scrollBtn.style.display = "block";
        } else {
            nav.classList.remove("sticky");
            scrollBtn.style.display = "none";
        }
    };
} else {
    if (!nav) console.log("Element with class 'nav' not found.");
    if (!scrollBtn) console.log("Element with class 'scroll-button a' not found.");
}

// Side Navigation Menu JS Code
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");

if (navBar && menuBtn && cancelBtn) {
    menuBtn.onclick = function() {
        navBar.classList.add("active");
        menuBtn.style.opacity = "0";
        menuBtn.style.pointerEvents = "none";
        if (body) body.style.overflow = "hidden";
        if (scrollBtn) scrollBtn.style.pointerEvents = "none";
    };
    cancelBtn.onclick = function() {
        navBar.classList.remove("active");
        menuBtn.style.opacity = "1";
        menuBtn.style.pointerEvents = "auto";
        if (body) body.style.overflow = "auto";
        if (scrollBtn) scrollBtn.style.pointerEvents = "auto";
    };
} else {
    if (!navBar) console.log("Element with class 'navbar' not found.");
    if (!menuBtn) console.log("Element with class 'menu-btn' not found.");
    if (!cancelBtn) console.log("Element with class 'cancel-btn' not found.");
}

// Side Navigation Bar Close While Clicking Navigation Links
let navLinks = document.querySelectorAll(".menu li a");

if (navLinks.length > 0) {
    for (var i = 0; i < navLinks.length; i++) {
        navLinks[i].addEventListener("click", function() {
            if (navBar) navBar.classList.remove("active");
            if (menuBtn) {
                menuBtn.style.opacity = "1";
                menuBtn.style.pointerEvents = "auto";
            }
        });
    }
} else {
    console.log("No elements found with class 'menu li a'.");
}








// Define social media links
const socialMediaLinks = [
    { href: "https://instagram.com/mbktech.studios", icon: "fab fa-instagram", target: "_blank" },
    { href: "https://www.facebook.com/people/MBK-Tech-Studio/61559079077988/", icon: "fab fa-facebook-f", target: "_blank" },
    { href: "https://www.linkedin.com/in/muhammad-bin-khalid-89711b25b", icon: "fab fa-linkedin", target: "_blank" },
    { href: "https://x.com/ibnekhalid28", icon: "fab fa-twitter", target: "_blank" },
    { href: "https://github.com/MIbnEKhalid", icon: "fab fa-github", target: "_blank" },
    { href: "https://youtube.com/@mibnekhalid", icon: "fab fa-youtube", target: "_blank" },
    { href: "https://discord.gg/", icon: "fab fa-discord", target: "_blank" },
    { href: "https://signal.me/#eu/0Bxn3qmtp8gtYNuy6eJ_F3WaHWHrQW3uefaC2y01VCWtduFQCwJHvIFL6N4VOtsv", icon: "fa-brands fa-signal-messenger", target: "_blank" },
];

// Function to populate social media icons
function populateIcons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; // Ensure container exists
    container.innerHTML = ""; // Clear existing content
    socialMediaLinks.forEach(link => {
        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.target = link.target;
        anchor.innerHTML = `<i class="${link.icon}"></i>`;
        container.appendChild(anchor);
    });
}

// Wait for DOM to load before executing
document.addEventListener("DOMContentLoaded", function () {
    populateIcons("media-icons");  // Populate media icons for "media-icons"
    populateIcons("media-icons-m");  // Populate media icons for "media-icons-m"

    // Populate icons for "ssmedia" if it exists
    const ssmediaElement = document.getElementById("ssmedia");
    if (ssmediaElement) {
        ssmediaElement.innerHTML = ""; // Clear existing content
        socialMediaLinks.forEach(link => {
            const anchor = document.createElement("a");
            anchor.href = link.href;
            anchor.target = link.target;
            anchor.innerHTML = `<i class="${link.icon}"></i>`;
            ssmediaElement.appendChild(anchor);
        });
    }
});


