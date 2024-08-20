// Sticky Navigation Menu JS Code
let nav = document.querySelector("nav");
let scrollBtn = document.querySelector(".scroll-button a");
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
}

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
	scrollBtn.style.pointerEvents = "none";
}
cancelBtn.onclick = function() {
	navBar.classList.remove("active");
	menuBtn.style.opacity = "1";
	menuBtn.style.pointerEvents = "auto";
	body.style.overflow = "auto";
	scrollBtn.style.pointerEvents = "auto";
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

function getPageUrl() {
	return window.location.href;
}

function resetMessageBoxColor() {
	document.getElementById("message").style.backgroundColor = "beige";
	document.getElementById("message").style.color = "green";
}

//Credit: TechLever (youtube.com/@tech-lever)
document.getElementById("form").addEventListener("submit", function(e) {
	e.preventDefault();
	resetMessageBoxColor();
	document.getElementById("message").textContent = "Submitting..";
	document.getElementById("message").style.display = "block";
	document.getElementById("submit-button").disabled = true;

	var currentDate = new Date();
	var day = String(currentDate.getDate()).padStart(2, "0");
	var month = String(currentDate.getMonth() + 1).padStart(2, "0");
	var year = currentDate.getFullYear();
	var hours = String(currentDate.getHours()).padStart(2, "0");
	var minutes = String(currentDate.getMinutes()).padStart(2, "0");
	var seconds = String(currentDate.getSeconds()).padStart(2, "0");

	// 12-hour format conversion
	var hours12 = hours % 12 || 12; // Converts to 12-hour format
	var period = currentDate.getHours() >= 12 ? "PM" : "AM";

	// Retrieve the time zone
	var region = Intl.DateTimeFormat().resolvedOptions().timeZone;

	var timestamp = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} or ${hours12}:${minutes}:${seconds} ${period} ${region}`;

	var countryCode = $("#mobile_code").intlTelInput("getSelectedCountryData").dialCode;
	var inputNumber = document.querySelector('input[name="Number"]').value;
	var combinedNumber = "+" + countryCode + inputNumber; // Add the '+' sign here
	document.querySelector('input[name="Timestamp"]').value = timestamp;
	document.querySelector('input[name="Number"]').value = combinedNumber;
	document.querySelector('input[name="pageUrl"]').value = getPageUrl();

	var formData = new FormData(this);

	fetch("https://api.web3forms.com/submit", {
		method: "POST",
		body: formData
	}).then(function(response) {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error("Failed to submit the form.");
		}
	}).then(function(data) {
		document.getElementById("message").textContent = "Message Submitted Successfully!";
		document.getElementById("message").style.display = "block";
		document.getElementById("message").style.backgroundColor = "green";
		document.getElementById("message").style.color = "beige";
		document.getElementById("submit-button").disabled = false;
		document.getElementById("form").reset();

		setTimeout(function() {
			document.getElementById("message").textContent = "";
			document.getElementById("message").style.display = "none";
			var numberField = document.querySelector(".phoneField");
			numberField.style.display = "none";
			var supportField = document.querySelector(".supportfield");
			supportField.style.display = "none";
		}, 2000);
	}).catch(function(error) {
		console.error(error);
		messageBox.textContent = "An error occurred while submitting the form.";
	});
});
// Function to handle change event of the subject select

document.getElementById("subjectSelect").addEventListener("change", function() {
	var numberField = document.querySelector(".phoneField");
	var ratingField = document.querySelector(".ratingWeb");
	var supportField = document.querySelector(".supportfield");

	// Get the value of the selected option
	var selectedOption = this.value;

	if (selectedOption === "Collaboration") {
		// Show phone number field for collaboration
		numberField.style.display = "block";
		document.querySelector('input[name="Number"]').setAttribute("required", "required");

		// Hide rating field
		ratingField.style.display = "none";
		document.querySelectorAll('input[name="stars"]').forEach(function(input) {
			input.removeAttribute("required");
		});

		// Hide support field
		supportField.style.display = "none";
		document.querySelectorAll('select[name="support"]').forEach(function(input) {
			input.removeAttribute("required");
		});
	} else if (selectedOption === "Feedback") {
		// Show rating field for feedback
		ratingField.style.display = "block";
		document.querySelectorAll('input[name="stars"]').forEach(function(input) {
			input.setAttribute("required", "required");
		});

		// Hide phone number field
		numberField.style.display = "none";
		document.querySelector('input[name="Number"]').removeAttribute("required");

		// Hide support field
		supportField.style.display = "none";
		document.querySelectorAll('select[name="support"]').forEach(function(input) {
			input.removeAttribute("required");
		});
	} else if (selectedOption === "Support") {
		// Show support field for support
		supportField.style.display = "block";
		document.querySelectorAll('select[name="support"]').forEach(function(input) {
			input.setAttribute("required", "required");
		});

		// Show phone number field for support
		numberField.style.display = "block";
		document.querySelector('input[name="Number"]').setAttribute("required", "required");

		// Hide rating field
		ratingField.style.display = "none";
		document.querySelectorAll('input[name="stars"]').forEach(function(input) {
			input.removeAttribute("required");
		});
	} else {
		// Hide all additional fields for other options
		numberField.style.display = "none";
		document.querySelector('input[name="Number"]').removeAttribute("required");
		ratingField.style.display = "none";
		document.querySelectorAll('input[name="stars"]').forEach(function(input) {
			input.removeAttribute("required");
		});
		supportField.style.display = "none";
		document.querySelectorAll('select[name="support"]').forEach(function(input) {
			input.removeAttribute("required");
		});
	}
});

function DownloadCVFile() {
	// Define the file URL
	var fileUrl = 'https://mbktechstudio.com/Assets/MBK_CV.pdf'; // Replace this with the actual file URL

	// Check if the user is on a mobile device
	var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

	if (isMobile) {
		// If user is on a mobile device, initiate download
		var a = document.createElement('a');
		a.href = fileUrl;
		a.download = 'MBK_CV.pdf'; // Set the desired filename here
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	} else {
		// If user is on a desktop, open in a new tab/window
		window.open(fileUrl, '_blank');
	}
}

function HireMeLink() {
	window.open('https://www.linkedin.com/in/muhammad-bin-khalid-89711b25b', '_blank'); // Replace with your target URL
}

function openProjectPage(id) {
	window.open('https://project.mbktechstudio.com/#' + id, '_blank'); // Replace with your target URL
}

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
