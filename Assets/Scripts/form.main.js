

function getPageUrl() {
    return window.location.href;
}

function resetMessageBoxColor() {
    document.getElementById("message").style.backgroundColor = "beige";
    document.getElementById("message").style.color = "green";
}

document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault();
    resetMessageBoxColor();
    document.getElementById("message").textContent = "Submitting..";
    document.getElementById("message").style.display = "block";
    document.getElementById("submit-button").disabled = true; 

    // Proceed with the form submission after gathering the user information
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
    var combinedNumber = "+" + countryCode + inputNumber;
    document.querySelector('input[name="Timestamp"]').value = timestamp;
    document.querySelector('input[name="Number"]').value = combinedNumber;
    document.querySelector('input[name="PageUrl"]').value = getPageUrl();

    var formData = new FormData(this); 

    // Submit the form with additional user information
    fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
    }).then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error("Failed to submit the form.");
        }
    }).then(function (data) {
        document.getElementById("message").textContent = "Message Submitted Successfully!";
        document.getElementById("message").style.display = "block";
        document.getElementById("message").style.backgroundColor = "green";
        document.getElementById("message").style.color = "beige";
        document.getElementById("submit-button").disabled = false;
        document.getElementById("form").reset();

        setTimeout(function () {
            document.getElementById("message").textContent = "";
            document.getElementById("message").style.display = "none"; 
        }, 2000);
    }).catch(function (error) {
        console.error(error);
        document.getElementById("message").textContent = "An error occurred while submitting the form.";
        document.getElementById("message").style.backgroundColor = "red";
    });
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

