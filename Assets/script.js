// Sticky Navigation Menu JS Code
let nav = document.querySelector("nav");
 let val; 

// Side NavIgation Menu JS Code
let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = function() {
	navBar.classList.add("active");
	menuBtn.style.opacity = "0";
	menuBtn.style.pointerEvents = "none";
	body.style.overflow = "hidden";
 }
cancelBtn.onclick = function() {
	navBar.classList.remove("active");
	menuBtn.style.opacity = "1";
	menuBtn.style.pointerEvents = "auto";
	body.style.overflow = "auto";
}

// Side Navigation Bar Close While We Click On Navigation Links
let navLinks = document.querySelectorAll(".menu li a");
for (var i = 0; i < navLinks.length; i++) {
	navLinks[i].addEventListener("click", function() {
		navBar.classList.remove("active");
		menuBtn.style.opacity = "1";
		menuBtn.style.pointerEvents = "auto";
	});
}


