function resetMessageBoxStyle() {
    const messageBox = document.getElementById("message");
    messageBox.className = "message-box info";
}

function showmessage(content, type = "info") {
    const messageBox = document.getElementById("message");
    messageBox.style.color = "green";
    messageBox.textContent = content;
    messageBox.style.display = "block";
    messageBox.className = `message-box ${type}`;
    if (type === "error") {
        messageBox.style.color = "red";
        messageBox.innerHTML =
            content +
            " Please Try Again Later Or Contact Us Directly At: <a class='links' title='support@mbktechstudio.com' href='mailto:support@mbktechstudio.com'>support@mbktechstudio.com</a> for Contact & Support.";
    }
}

function getPageUrl() {
    return window.location.href;
}

document.getElementById("form").addEventListener("submit", async function (e) {
    e.preventDefault();
    resetMessageBoxStyle();
    showmessage("Submitting..", "info");
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

    // Convert form data to a plain object
    const formObj = Object.fromEntries(new FormData(this));

    // Send JSON data to the server
    fetch("/post/SubmitForm", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formObj),
    })
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Failed to submit the form.");
            }
        })
        .then(function (data) {
            showmessage("Form Submitted Successfully!", "success");

            if (subjectSelect.value === "Support") {
                showMessage(
                    `Form Submitted Successfully!<br>
                <div class="ticketRow">
                    <input type="text" id="ticketInput" class="messageInputField" value="${data.TN}" readonly onclick="copyValue(this)" />
                </div> 
                <span class="copyInstructions">Click on the ticket number to copy it.</span>
                <span class="copyInstructions">You can use this ticket number to track your request.</span>`,
                    "Success"
                );
            }
            else {
                showMessage("Form Submitted Successfully!", "Success");
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
            showmessage("An error occurred while submitting the form.", "error");
            showMessage("An error occurred while submitting the form.", "Error");
            document.getElementById("submit-button").disabled = false;
        });
});