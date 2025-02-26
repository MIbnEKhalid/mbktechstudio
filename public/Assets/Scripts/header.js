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