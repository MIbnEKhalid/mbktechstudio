// Global Var
var supportField = document.querySelector(".supportfield");
const subjectSelect = document.getElementById("subjectSelect");
const supportSelect = document.getElementById("supportselect");
const messageForm = document.getElementById("message_form");
var numberField = document.querySelector(".phoneField");
var ratingField = document.querySelector(".ratingWeb");
var projectCatogery = document.querySelector(".projectCatogo");
var blogCatogery = document.querySelector(".blogCatogo");
var messageBox = document.getElementById("message");

var projects = [];
var blogs = [];

document.addEventListener("DOMContentLoaded", function() {
    const projectSelect = document.getElementById("projectCatogo");
    const blogSelect = document.getElementById("blogCatogo");

    // Fetch and handle projects JSON
    fetch('https://raw.githubusercontent.com/MIbnEKhalid/MIbnEKhalid.github.io/refs/heads/main/public/Assets/Support/projects.json')
        .then(response => response.json())
        .then(data => {
            projects = data; // Assign fetched data to the global projects variable
            populateSelect(projectSelect, projects);
            initializeSelection('Project', projects, projectSelect, handleProjectSelection);
        })
        .catch(error => console.error("Error loading projects:", error));

    // Fetch and handle blogs JSON
    fetch('https://blog.mbktechstudio.com/blogs.json')
        .then(response => response.json())
        .then(data => {
            blogs = data; // Assign fetched data to the global blogs variable
            populateSelect(blogSelect, blogs);
            initializeSelection('Blog', blogs, blogSelect, handleBlogSelection);
        })
        .catch(error => console.error("Error loading blogs:", error));

    const ticketParam = getUrlParameter('Ticket') || getUrlParameter('ticket');
    if (ticketParam && ticketParam.length === 10) {
        showbox('tS-form');
        document.getElementById('ticketId').value = ticketParam;
        document.getElementById('ticketStatusForm').dispatchEvent(new Event('submit'));
    }
});

// Populate dropdown with items
function populateSelect(selectElement, items) {
    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item.value;
        option.textContent = item.name;
        selectElement.appendChild(option);
    });
}

// Initialize selection based on URL parameter
function initializeSelection(paramName, items, selectElement, callback) {
    const paramValue = getUrlParameter(paramName);
    const selectedItem = items.find(item => item.value === paramValue);

    if (selectedItem) {
        selectElement.value = selectedItem.value;
        callback(selectedItem.value); // Execute callback if provided
    }
}

// Get URL parameter value by name
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Handle project selection
function handleProjectSelection(selectedValue) {
    const selectedProject = projects.find(project => project.value === selectedValue);

    if (selectedProject) {
        // Show support field
        supportField.style.display = "block";
        supportSelect.style.display = "block";
        projectCatogery.style.display = "block";

        // Set required attributes
        document.querySelectorAll('select[name="support"]').forEach(input => input.setAttribute("required", "required"));
        document.querySelectorAll('select[name="projectCato"]').forEach(input => input.setAttribute("required", "required"));

        // Update subject and selection
        subjectSelect.value = "Support";
        document.getElementById("projectCatogo").value = selectedProject.value;

        // Show link for the project
        showLink("projectLink", "projectCatogo");
    }
}

// Handle blog selection
function handleBlogSelection(selectedValue) {
    const selectedBlog = blogs.find(blog => blog.value === selectedValue);

    if (selectedBlog) {
        // Show support field
        supportField.style.display = "block";
        blogCatogery.style.display = "block";

        // Update subject and selection
        subjectSelect.value = "Support";
        document.getElementById("blogCatogo").value = selectedBlog.value;

        // Set the "Support" dropdown to "Blog"
        const supportDropdown = document.getElementById("supportselect");
        if (supportDropdown) {
            const blogOption = Array.from(supportDropdown.options).find(option => option.textContent === "Blog");
            if (blogOption) {
                supportDropdown.value = blogOption.value;
            }
        }

        // Show link for the blog
        showLink("blogLink", "blogCatogo");
    }
}

// Show link for the selected item
function showLink(linkID, fieldID) {
    const selectedValue = document.getElementById(fieldID).value;
    const items = fieldID === "projectCatogo" ? projects : blogs;
    const item = items.find(i => i.value === selectedValue);
    const linkElement = document.getElementById(linkID);

    if (item && item.link) {
        linkElement.href = item.link;
        linkElement.style.display = "inline"; // Show link if available
    } else {
        linkElement.style.display = "none"; // Hide link if not available
    }
}

$("#mobile_code").intlTelInput({
    initialCountry: "pk",
    separateDialCode: true
        // utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.4/js/utils.js"
}).on("input", function(e) {
    var input = e.target.value;
    e.target.value = input.replace(/[^0-9]/g, '').slice(0, 11);
    if (e.target.value.length < 10) {
        e.target.setCustomValidity("Phone number must be at least 10 digits.");
    } else {
        e.target.setCustomValidity("");
    }
});



function remove() {
    let i = 0;
    while (i < 5) {
        stars[i].className = "star";
        i++;
    }
}

document.getElementById("subjectSelect").addEventListener("change", function() {

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

        // Hide project category field
        projectCatogery.style.display = "none";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.removeAttribute("required");
        });

        // Hide Blog category field
        blogCatogery.style.display = "none";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
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

        // Hide project category field
        projectCatogery.style.display = "none";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.removeAttribute("required");
        });

        // Hide Blog category field
        blogCatogery.style.display = "none";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
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
        //document.querySelector('input[name="Number"]').setAttribute("required", "required");

        // Hide rating field
        ratingField.style.display = "none";
        document.querySelectorAll('input[name="stars"]').forEach(function(input) {
            input.removeAttribute("required");
        });
    } else if (selectedOption === "General Inquiry") {


        // Hide all additional fields for other options
        numberField.style.display = "none";
        document.querySelector('input[name="Number"]').removeAttribute("required");

        // Hide rating field
        ratingField.style.display = "none";
        document.querySelectorAll('input[name="stars"]').forEach(function(input) {
            input.removeAttribute("required");
        });

        // Show support field for support
        supportField.style.display = "none";
        document.querySelectorAll('select[name="support"]').forEach(function(input) {
            input.removeAttribute("required");
        });

        // Hide project category field
        projectCatogery.style.display = "none";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.removeAttribute("required");
        });

        // Hide Blog category field
        blogCatogery.style.display = "none";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
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
        projectCatogery.style.display = "none";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.removeAttribute("required");
        });
        // Hide Blog category field
        blogCatogery.style.display = "none";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
            input.removeAttribute("required");
        });
    }
});

document.getElementById("supportselect").addEventListener("change", function() {

    var selectedOption = this.value;
    //selectedOption === "Blogs" || selectedOption === "Docs"
    if (selectedOption === "Technical" || selectedOption === "CopyRightIssue" || selectedOption === "SourceCodeAssistance" || selectedOption === "BugReportingFeatureRequests" || selectedOption === "other") {
        projectCatogery.style.display = "block";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.setAttribute("required", "required");
        });
        // Hide Blog category field
        blogCatogery.style.display = "none";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
            input.removeAttribute("required");
        });
    } else if (selectedOption === "Blogs") {
        blogCatogery.style.display = "block";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
            input.setAttribute("required", "required");
        });
        projectCatogery.style.display = "none";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.removeAttribute("required");
        });
    } else if (selectedOption === "Docs") {
        blogCatogery.style.display = "none";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
            input.removeAttribute("required");
        });
        projectCatogery.style.display = "none";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.removeAttribute("required");
        });
    } else {
        projectCatogery.style.display = "none";
        document.querySelectorAll('select[name="projectCato"]').forEach(function(input) {
            input.removeAttribute("required");
        });

        blogCatogery.style.display = "none";
        document.querySelectorAll('select[name="blogCatogo"]').forEach(function(input) {
            input.removeAttribute("required");
        });
    }
});




function copyTicketNumber() {
    const ticketInput = document.getElementById('ticketNumber');
    ticketInput.select(); // Selects the content of the input field
    document.execCommand('copy'); // Copies the content to clipboard
    alert("Ticket number copied to clipboard!"); // Optional: Alert to notify the user
}

function hidebox(link) {
    document.getElementById(link).classList.remove('show');
}

function showbox(link) {
    document.getElementById(link).classList.add('show');
}

document.getElementById('ticketStatusForm').addEventListener('submit', function(event) {
    event.preventDefault();

    let ticketId = document.getElementById('ticketId').value;

    // Fetch the ticket data from Google Drive JSON file
    fetch('ticket.json')
        .then(response => response.json())
        .then(ticketData => {
            let ticketStatuses = checkTicketStatus(ticketId, ticketData);

            let ticketStatusDiv = document.getElementById('ticketStatus');
            if (ticketStatuses.length > 0) {
                // Wrap the table in a div with scrollable property
                let tableHTML = `
                        <div id="tableContainer">
                            <table border="1">
                                <tr>
                                    <th>ID</th>
                                    <th>Status</th>
                                    <th>Comments</th> 
                                </tr>
                    `;

                // Loop through all matching tickets and add rows to the table
                ticketStatuses.forEach(ticket => {
                    tableHTML += `
                            <tr>
                                <td>${ticket.id}</td>
                                <td>${ticket.status}</td>
                                <td>${ticket.description}, ${ticket.comment}</td> 
                            </tr>
                        `;
                });

                tableHTML += '</table></div>';
                ticketStatusDiv.innerHTML = tableHTML;
            } else {
                ticketStatusDiv.innerHTML = '<p class="notFound">Your Ticket Might Have Been Created, But It Has Not Yet Been Reviewed By The Support Team. Please Double-Check Your ID Number Or Try Again Later.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching the ticket data:', error);
            document.getElementById('ticketStatus').innerHTML = 'There was an error retrieving ticket data. Please try again later.';
        });
});

function checkTicketStatus(ticketId, ticketData) {
    // Filter the tickets array to find all tickets with the matching ticketId
    return ticketData.filter(ticket => ticket.id === ticketId);
}

/*


    //phone

    $("#mobile_code").intlTelInput({
        initialCountry: "pk",
        separateDialCode: true
        // utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/11.0.4/js/utils.js"
    });

    function remove() {
        let i = 0;
        while (i < 5) {
            stars[i].className = "star";
            i++;
        }
    }
*/