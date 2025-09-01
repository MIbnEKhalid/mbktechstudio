function resetMessageBoxStyle() {
    const messageBox = document.getElementById("message");
    messageBox.className = "message-box info";
}

function getPageUrl() {
    return window.location.href;
}

// Function to copy ticket number to clipboard
function copyValue(element) {
    element.select();
    element.setSelectionRange(0, 99999); // For mobile devices
    navigator.clipboard.writeText(element.value).then(function () {
        // Visual feedback
        const originalValue = element.value;
        element.value = "Copied!";
        setTimeout(function () {
            element.value = originalValue;
        }, 1000);
    }).catch(function (err) {
        console.error('Could not copy text: ', err);
        // Fallback for older browsers
        document.execCommand('copy');
    });
}

// Handle subject selection changes
document.getElementById("subjectSelect").addEventListener("change", function() {
    const servicesField = document.querySelector(".servicesfield");
    const supportField = document.querySelector(".supportfield");
    const ratingField = document.querySelector(".ratingWeb");
    const phoneField = document.querySelector(".phoneField");
    
    // Hide all conditional fields first
    servicesField.style.display = "none";
    supportField.style.display = "none";
    ratingField.style.display = "none";
    phoneField.style.display = "none";
    
    // Show relevant fields based on selection
    switch(this.value) {
        case "Get Quote":
            servicesField.style.display = "block";
            phoneField.style.display = "block";
            break;
        case "Support":
            supportField.style.display = "block";
            phoneField.style.display = "block";
            break;
        case "Feedback":
            ratingField.style.display = "block";
            break;
        case "Collaboration":
            phoneField.style.display = "block";
            break;
    }
});

document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault();
    resetMessageBoxStyle();
    showMessage("Submitting..", "info");
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

    // Convert form data to a plain object
    const formObj = Object.fromEntries(new FormData(this));

    // Add default priority
    if (!formObj.priority) {
        formObj.priority = 'normal';
    }

    // Send JSON data to the server
    fetch("/post/SubmitForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formObj),
    })
        .then(async function (response) { // make async
            if (response.ok) {
                return response.json();
            }
            // If response is not ok, create an error with details from the body
            const errorData = await response.json().catch(() => null); // Try to parse error body
            const errorMessage = errorData?.details || errorData?.error || `Server responded with ${response.status}`;
            throw new Error(errorMessage);
        })
        .then(function (data) {
            console.log('Server response:', data); // Debug logging
            showMessage("Form Submitted Successfully!", "success");

            if (subjectSelect.value === "Support") {
                const ticketNumber = data.ticketNumber || data.TN; // Handle both new and old response formats

                if (ticketNumber) {
                    showMessage(
                        `Form Submitted Successfully!<br>
                    <div class="ticketRow">
                        <input type="text" id="ticketInput" class="messageInputField" value="${ticketNumber}" readonly onclick="copyValue(this)" />
                    </div> 
                    <span class="copyInstructions">Click on the ticket number to copy it.</span>
                    <span class="copyInstructions">You can use this ticket number to track your request at <a href="/TrackTicket" class="links">Track Ticket</a>.</span>`,
                        "success"
                    );
                } else {
                    showMessage("Support request submitted successfully! You should receive a ticket number if this was a support request.", "success");
                }
            } else {
                showMessage("Form Submitted Successfully!", "success");
            }

            document.getElementById("submit-button").disabled = false;
            document.getElementById("form").reset();

            // showbox('tG-form');

            setTimeout(function () {
                document.getElementById("message").style.display = "none"; // Hide message box

                // Hide additional fields if necessary
                if (numberField) {
                    numberField.style.display = "none";
                    numberField.value = null;
                }
                if (supportField) {
                    supportField.style.display = "none";
                    supportField.value = null;
                }
                if (projectCatogery) {
                    projectCatogery.style.display = "none";
                    projectCatogery.value = null;
                }
                if (window.location.hash) {
                    history.replaceState(null, null, window.location.pathname);
                }
                const url = new URL(window.location);
                url.searchParams.delete("Project");
                window.history.replaceState({}, document.title, url);
            }, 2000);
        })
        .catch(function (error) {
            console.error(error);
            showMessage(error.message, "error");
            document.getElementById("submit-button").disabled = false;
        });
});