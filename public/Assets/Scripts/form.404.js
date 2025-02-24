 
  function showbox() {
    document.getElementById('c-form').classList.add('show');
  }

  function hidebox() {
    document.getElementById('c-form').classList.remove('show');
  }
  function reloadPage() {
    location.reload();
  }

  function loadPage(url) {
    if(url === 'home') {
      location.href = "/";
    }
    else if(url === 'Support') {
      location.href = "/Support?template=404&path="+window.location.pathname.replace(/\//g, '%2F');
    }
  }

  var path = window.location.pathname;
  var segments = path.split('/').filter(segment => segment); // Remove empty segments
  var filename = segments.pop() || 'index.html'; // Default to 'index.html' if no filename is present
  var parentFolder = segments.pop() || ''; // Get the parent folder
  var displayPath = parentFolder ? `${parentFolder}/${filename}` : filename;
  document.getElementById('display-path').textContent = displayPath;

  function getPageUrl() {
    return window.location.href;
  }

  // Set the value of the input field with the page URL
  document.getElementById('pageUrlInput').value = getPageUrl();
  function resetMessageBoxColor() {
    var messageBox = document.getElementById("message");
    messageBox.style.backgroundColor = "beige";
    messageBox.style.color = "green";
  }
  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    resetMessageBoxColor();
    var messageBox = document.getElementById("message");
    messageBox.textContent = "Submitting..";
    messageBox.style.display = "block";
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


    document.querySelector('input[name="Timestamp"]').value = timestamp;
    document.querySelector('input[name="PageUrl"]').value = getPageUrl();

    var formData = new FormData(this);

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
      messageBox.textContent = "Message Submitted Successfully!";
      messageBox.style.backgroundColor = "green";
      messageBox.style.color = "beige";
      document.getElementById("submit-button").disabled = false;
      document.getElementById("form").reset();

      setTimeout(function () {
        messageBox.textContent = "";
        messageBox.style.display = "none";
        // Hide additional fields if necessary
        var numberField = document.querySelector(".phoneField");
        if (numberField) numberField.style.display = "none";
        var supportField = document.querySelector(".supportfield");
        if (supportField) supportField.style.display = "none";
      }, 2000);
    }).catch(function (error) {
      console.error(error);
      messageBox.textContent = "An error occurred while submitting the form.";
    });
  }); 