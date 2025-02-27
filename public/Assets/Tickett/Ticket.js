document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    searchTicket();
});

// Toggle FAQ answer visibility
function toggleAnswer(id) {
    const answer = document.getElementById("answer" + id);
    const icon = answer.previousElementSibling.querySelector("i");
    if (answer.style.display === "block") {
        answer.style.display = "none";
        icon.classList.replace("fa-minus-circle", "fa-plus-circle");
    } else {
        answer.style.display = "block";
        icon.classList.replace("fa-plus-circle", "fa-minus-circle");
    }
}

window.onload = function () {
    const hash = window.location.hash;
    const ticketParam = hash.substring(1); // Remove the '#' character

    // Check if the ticket ID starts with 'T' followed by any alphanumeric characters
    if (ticketParam && /^T[A-Za-z0-9]+$/.test(ticketParam)) {
        document.getElementById("ticketNumber").value = ticketParam;
        searchTicket();
    }
};

async function searchTicket() {
    const ticketNumber = document.getElementById("ticketNumber").value.trim();

    if (!ticketNumber) {
        alert("Please enter a ticket number.");
        return;
    }

    try {
        document.getElementById("RedultMessgeCont").style.display = "block";
        document.getElementById("RedultMessge").textContent = "Searching...";

        const response = await fetch(`/api/tickets/${ticketNumber}`);
        if (!response.ok) {
            if (response.headers.get('Content-Type')?.includes('text/html')) {
                throw new Error("Received an HTML response instead of JSON. Please check the API endpoint.");
            }
            if (response.status === 404) {
                displayNotFound();
                return;
            }
            throw new Error(`Failed to load ticket data. Status: ${response.status}`);
        }

        const ticket = await response.json();

        const resultsContainer = document.getElementById("ticketResultsContainer");
        resultsContainer.innerHTML = ""; // Clear previous results

        displayTicket(ticket);
        document.getElementById("notfound").style.display = "none";


        document.getElementById("RedultMessgeCont").style.display = "flex";
        document.getElementById("RedultMessge").textContent = "Ticket Found!";

        window.scrollTo({
            top: resultsContainer.offsetTop - 165,
            behavior: 'smooth',
        });
    } catch (error) {
        console.error("Error fetching ticket data:", error);
        alert("Unable to fetch ticket data. Please try again later.");
    }
}


function displayTicket(ticket) {
    const resultsContainer = document.getElementById("ticketResultsContainer");
    const ticketElement = document.createElement("div");

    if (typeof ticket.auditTrail === 'string') {
        try {
            ticket.auditTrail = JSON.parse(ticket.auditTrail);
        } catch (error) {
            console.error("Failed to parse auditTrail for ticket:", ticket.ticketno, error);
            ticket.auditTrail = [];
        }
    }

    // Function to get tooltip text based on ticket status
function getTooltipText(status) {
    switch (status) {
        case 'Pending':
            return 'Your ticket is pending review and has not been assigned yet.';
        case 'Closed':
            return 'This ticket has been closed and is no longer active.';
        case 'In Progress':
            return 'This ticket is currently being worked on by our team.';
        case 'Open':
            return 'Your ticket has been received and is awaiting review.';
        case 'Resolved':
            return 'This ticket has been resolved and closed.';
        default:
            return 'Unknown status';
    }
}

    ticketElement.className = "section result-card";
    ticketElement.innerHTML = `
        <h3 class="head"><i class="fas fa-ticket-alt"></i> Ticket Details</h3>
        <p><i class="fas fa-hashtag"></i> <strong>Ticket Number:</strong> ${ticket.ticketno}</p>
        <p><i class="fas fa-info-circle"></i> <strong>Issue:</strong> ${ticket.title}</p>
        <p><i class="fas fa-exclamation-circle"></i> <strong>Status:</strong>
            <span class="status-badge ${ticket.status}">
                ${ticket.status}
                <span class="tooltip">
                    <i class="status-icon fas fa-info-circle"></i>
                    <span class="tooltiptext">${getTooltipText(ticket.status)}</span>
                </span>
            </span>
        </p>
        <p><i class="fas fa-user"></i> <strong>Submitted By:</strong> ${ticket.name}</p>
        <p><i class="fas fa-calendar-alt"></i> <strong>Created On:</strong> ${ticket.createdDate}</p>
        <p><i class="fas fa-clock"></i> <strong>Last Updated:</strong> ${ticket.lastUpdated}</p>
        <div class="audit-trail-section">
            <div class="audit-trail-header" onclick="toggleAuditTrail('auditTrailContainer')">
                <h3 class="auditTrailHeader">Audit Trail <i id="auditTrailToggleIcon" class="fas fa-chevron-down"></i></h3>
            </div>
            <div id="auditTrailContainer" style="visibility: hidden; display: none;">
                <ul id="resultAuditTrail">
                    ${ticket.auditTrail.map(entry => `
                        <li>
                            <strong class="audit-action-${entry.type}">${entry.action}</strong>
                            <span>${new Date(entry.timestamp).toLocaleString()}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </div>
    `; 
initTooltips();
    resultsContainer.appendChild(ticketElement);
    resultsContainer.style.display = "block";
}

function displayNotFound() {
    document.getElementById("ticketResultsContainer").style.display = "none";
    document.getElementById("notfound").style.display = "block";
    document.getElementById("RedultMessge").textContent = "No Ticket Found!";
    const notFoundContainer = document.getElementById("notfound");

    window.scrollTo({
        top: notFoundContainer.offsetTop - 240,
        behavior: 'smooth',
    });
}

function toggleAuditTrail() {
    const auditTrailContainer = document.getElementById(`auditTrailContainer`);
    const toggleIcon = document.getElementById(`auditTrailToggleIcon`);

    if (auditTrailContainer.style.visibility === "hidden") {
        auditTrailContainer.style.display = "block";
        auditTrailContainer.style.visibility = "visible";
        auditTrailContainer.style.opacity = 0;
        auditTrailContainer.style.transition = "opacity 0.5s ease-in-out";
        setTimeout(() => {
            auditTrailContainer.style.opacity = 1;
        }, 10);
        toggleIcon.classList.replace("fa-chevron-down", "fa-chevron-up");
    } else {
        auditTrailContainer.style.opacity = 0;
        auditTrailContainer.style.transition = "opacity 0.5s ease-in-out";
        setTimeout(() => {
            auditTrailContainer.style.visibility = "hidden";
            auditTrailContainer.style.display = "none";
        }, 500);
        toggleIcon.classList.replace("fa-chevron-up", "fa-chevron-down");
    }
}

function clearSearchTicket() {
    document.getElementById("ticketNumber").value = "";
    document.getElementById("ticketResultsContainer").style.display = "none";
    document.getElementById("ticketResultsContainer").innerHTML = "";
    document.getElementById("notfound").style.display = "none";
    document.getElementById("RedultMessgeCont").style.display = "none";
}function initTooltips() {
    document.querySelectorAll('.tooltip').forEach(function(tooltip) {
        tooltip.addEventListener('click', function(e) {
            // Prevent event from bubbling up
            e.stopPropagation();
            // Toggle active class to show/hide tooltip
            tooltip.classList.toggle('active');
        });
    });
}

// Hide any visible tooltips when clicking elsewhere
document.addEventListener('click', function() {
    document.querySelectorAll('.tooltip.active').forEach(function(tooltip) {
        tooltip.classList.remove('active');
    });
});

