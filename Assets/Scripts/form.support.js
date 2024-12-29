function resetMessageBoxStyle() {
    const messageBox = document.getElementById("message");
    messageBox.className = "message-box info";
  }
  
  function showMessage(content, type = "info") {
    const messageBox = document.getElementById("message");
    messageBox.textContent = content;
    messageBox.style.display = "block";
    messageBox.className = `message-box ${type}`;
    if(type === "error") {
        messageBox.innerHTML = content + " Please Try Again Later Or Contact Us Directly At: <a class='links' title='support@mbktechstudio.com' href='mailto:support@mbktechstudio.com'>support@mbktechstudio.com</a> for Contact & Support.";
    }
  }

function getPageUrl() {
    return window.location.href;
}

document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    resetMessageBoxStyle();
    showMessage("Submitting..", "info");
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

    // Function to generate a ticket number
    function generateTicketNumber() {
        return 'T' + Math.random().toString(36).substring(2, 11).toUpperCase();
    }

    // Function to check if ticket number exists in the list
    function isTicketNumberUnique(ticketNumber, existingTickets) {
        return !existingTickets.some(ticket => ticket.id === ticketNumber);
    }

    // Function to generate and assign a unique ticket number
    function generateAndAssignTicketNumber(existingTickets) {
        let ticketNumber = generateTicketNumber();

        // Check if the generated ticket number exists in the existing tickets
        while (!isTicketNumberUnique(ticketNumber, existingTickets)) {
            ticketNumber = generateTicketNumber(); // Regenerate if a match is found
        }

        // Set the ticket number and URL
        document.querySelector('input[name="TicketNumber"]').value = ticketNumber;
        document.getElementById("TicketIdURL").textContent = `mbktechstudio.com/Ticket/#${ticketNumber}`;
        document.getElementById("TicketIdURL").href = `https://mbktechstudio.com/Ticket/#${ticketNumber}`;

        // Assign the ticket number to ticketNumberInput
        document.querySelector('input[name="ticketNumberInput"]').value = ticketNumber;
        console.log("Ticket Number Assigned: ", ticketNumber);  // For debugging
    }

    // Fetch existing tickets from t.json
    fetch('https://mbktechstudio.com/TrackTicket/Assets/TicketsData.json')  // Replace with the actual path to your JSON file
        .then(response => response.json())  // Parse the JSON data
        .then(data => {
            // Generate and assign a unique ticket number after loading the existing tickets
            generateAndAssignTicketNumber(data);
        })
        .catch(error => console.error('Error loading JSON:', error));

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
        showMessage("Message Submitted Successfully!", "success");
        document.getElementById("submit-button").disabled = false;
        document.getElementById("form").reset();

        showbox('tG-form'); 
 
        setTimeout(function () {
            document.getElementById("message").style.display = "none"; // Hide message box

            // Hide additional fields if necessary
            if (numberField) numberField.style.display = "none";
            if (supportField) supportField.style.display = "none";
            if (projectCatogery) projectCatogery.style.display = "none";
            if (noteW) noteW.style.display = "none";
            if (window.location.hash) {
                history.replaceState(null, null, window.location.pathname);
            }
            const url = new URL(window.location);
            url.searchParams.delete('Project');
            window.history.replaceState({}, document.title, url);
        }, 2000);
    }).catch(function (error) {
        console.error(error);
        showMessage("An error occurred while submitting the form.", "error");
    });
});