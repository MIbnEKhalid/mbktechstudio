let nav = document.querySelector("nav");
let val;

window.onscroll = function () {
    if (document.documentElement.scrollTop > 20) {
        nav.classList.add("sticky");
    } else {
        nav.classList.remove("sticky");
    }
}

let body = document.querySelector("body");
let navBar = document.querySelector(".navbar");
let menuBtn = document.querySelector(".menu-btn");
let cancelBtn = document.querySelector(".cancel-btn");
menuBtn.onclick = function () {
    navBar.classList.add("active");
    menuBtn.style.opacity = "0";
    menuBtn.style.pointerEvents = "none";
    body.style.overflow = "hidden";
    scrollBtn.style.pointerEvents = "none";
}
cancelBtn.onclick = function () {
    navBar.classList.remove("active");
    menuBtn.style.opacity = "1";
    menuBtn.style.pointerEvents = "auto";
    body.style.overflow = "auto";
    scrollBtn.style.pointerEvents = "auto";
}
let navLinks = document.querySelectorAll(".menu li a");
for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener("click", function () {
        navBar.classList.remove("active");
        menuBtn.style.opacity = "1";
        menuBtn.style.pointerEvents = "auto";
    });
} 























document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    searchTicket();
});
// Toggle FAQ answer visibility
function toggleAnswer(id) {
    var answer = document.getElementById("answer" + id);
    var icon = answer.previousElementSibling.querySelector("i");
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
}

async function searchTicket() {
    const ticketNumber = document.getElementById("ticketNumber").value.trim();

    if (!ticketNumber) {
        alert("Please enter a ticket number.");
        return;
    }

    try {
        const response = await fetch('t.json');
        if (!response.ok) {
            throw new Error("Failed to load ticket data.");
        }

        const tickets = await response.json();
        const matchingTickets = tickets.filter(ticket => ticket.id === ticketNumber);

        if (matchingTickets.length > 0) {
            const resultsContainer = document.getElementById("ticketResultsContainer");
            resultsContainer.innerHTML = ""; // Clear previous results

            matchingTickets.forEach((ticket, index) => {
                const uniqueId = `${ticket.id}-${ticket.name.replace(/\s+/g, '')}`;  // Remove spaces from name
                const ticketElement = document.createElement("div");
                ticketElement.className = "section result-card";
                ticketElement.innerHTML = `
            <h3><i class="fas fa-ticket-alt"></i> Ticket Details</h3>
            <p><i class="fas fa-hashtag"></i> <strong>Ticket Number:</strong> ${ticket.id}</p>
            <p><i class="fas fa-info-circle"></i> <strong>Issue:</strong> ${ticket.title}</p>
            <p><i class="fas fa-exclamation-circle"></i> <strong>Status:</strong>
                <span class="status-badge ${ticket.status}">${ticket.status}</span>
            </p>
            <p><i class="fas fa-user"></i> <strong>Submitted By:</strong> ${ticket.name}</p>
            <p><i class="fas fa-calendar-alt"></i> <strong>Created On:</strong> ${new Date(ticket.createdDate).toLocaleString()}</p>
            <p><i class="fas fa-clock"></i> <strong>Last Updated:</strong> ${new Date(ticket.lastUpdated).toLocaleString()}</p>
            
            <!-- Audit Trail Section -->
            <div class="audit-trail-section">
                <div class="audit-trail-header" onclick="toggleAuditTrail('${uniqueId}')">
                    <h4>Audit Trail <i id="auditTrailToggleIcon-${uniqueId}" class="fas fa-chevron-down"></i></h4>
                </div>
                <div id="auditTrailContainer-${uniqueId}" style="display: none;">
                    <ul id="resultAuditTrail-${uniqueId}">
                        ${ticket.auditTrail.map(entry => `
                            <li>
                                <strong class="audit-action-${entry.type}">
                                    ${entry.action}
                                </strong>
                                <span>${new Date(entry.timestamp).toLocaleString()}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
                resultsContainer.appendChild(ticketElement);
            });

            resultsContainer.style.display = "block";
            document.getElementById("notfound").style.display = "none";

            document.getElementById("RedultMessge").textContent = matchingTickets.length + " Ticket(s) Found!";
            document.getElementById("RedultMessgeCont").style.display = "flex";

            

            window.scrollTo({
                top: resultsContainer.offsetTop - 165, // Adjust the offset value as needed
                behavior: 'smooth'
            });


            if (matchingTickets.length > 1) {
                //alert("Multiple tickets found. Please check the ticket details such as name or issue date to identify your ticket.");
                // Ask the user to enter the name associated with the ticket
                const nameInput = prompt("Multiple tickets found. Please enter the Full name associated with the ticket:");

                // Filter the matchingTickets by name
                const nameFilteredTickets = matchingTickets.filter(
                    ticket => ticket.name.toLowerCase() === nameInput.toLowerCase()
                );

                if (nameFilteredTickets.length === 1) {
                    // Clear previous results
                    resultsContainer.innerHTML = "";
                    // Display the specific ticket
                    const ticket = nameFilteredTickets[0];
                    const uniqueId = `${ticket.id}-${ticket.name.replace(/\s+/g, '')}`;

                    const ticketElement = document.createElement("div");
                    ticketElement.className = "section result-card";
                    ticketElement.innerHTML = `
                        <h3><i class="fas fa-ticket-alt"></i> Ticket Details</h3>
                        <p><i class="fas fa-hashtag"></i> <strong>Ticket Number:</strong> ${ticket.id}</p>
                        <p><i class="fas fa-info-circle"></i> <strong>Issue:</strong> ${ticket.title}</p>
                        <p><i class="fas fa-exclamation-circle"></i> <strong>Status:</strong>
                            <span class="status-badge ${ticket.status}">${ticket.status}</span>
                        </p>
                        <p><i class="fas fa-user"></i> <strong>Submitted By:</strong> ${ticket.name}</p>
                        <p><i class="fas fa-calendar-alt"></i> <strong>Created On:</strong> ${new Date(ticket.createdDate).toLocaleString()}</p>
                        <p><i class="fas fa-clock"></i> <strong>Last Updated:</strong> ${new Date(ticket.lastUpdated).toLocaleString()}</p>
                        <div class="audit-trail-section">
                            <div class="audit-trail-header" onclick="toggleAuditTrail('${uniqueId}')">
                                <h4>Audit Trail <i id="auditTrailToggleIcon-${uniqueId}" class="fas fa-chevron-down"></i></h4>
                            </div>
                            <div id="auditTrailContainer-${uniqueId}" style="display: none;">
                                <ul id="resultAuditTrail-${uniqueId}">
                                    ${ticket.auditTrail.map(entry => `
                                        <li>
                                            <strong class="audit-action-${entry.type}">
                                                ${entry.action}
                                            </strong>
                                            <span>${new Date(entry.timestamp).toLocaleString()}</span>
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    `;
                    resultsContainer.appendChild(ticketElement);

                    document.getElementById("RedultMessge").textContent = "1 Ticket Found!";
                    document.getElementById("RedultMessgeCont").style.display = "flex";
                } else if (nameFilteredTickets.length > 1) {
                    alert("Multiple tickets found with that name. Please check the ticket details such as issue date to identify your ticket.");
                } else {
                    alert("No tickets found matching that name.");
                }
            }
       
       
        } else {
            document.getElementById("ticketResultsContainer").style.display = "none";
            document.getElementById("notfound").style.display = "block";
            document.getElementById("RedultMessge").textContent = "Your Ticket Might Have Been Created, But It Has Not Yet Been Reviewed By The Support Team. Please Double-Check Your ID Number Or Try Again Later.";
            document.getElementById("RedultMessgeCont").style.display = "flex";
            const resultsContainer = document.getElementById("notfound");

            window.scrollTo({
                top: resultsContainer.offsetTop - 240, // Adjust the offset value as needed
                behavior: 'smooth'
            });
        }
    } catch (error) {
        console.error("Error fetching ticket data:", error);
        alert("Unable to fetch ticket data. Please try again later.");
    }
}

// Updated toggleAuditTrail function to handle ticket-specific elements
function toggleAuditTrail(uniqueId) {
    const auditTrailContainer = document.getElementById(`auditTrailContainer-${uniqueId}`);
    const toggleIcon = document.getElementById(`auditTrailToggleIcon-${uniqueId}`);

    if (auditTrailContainer.style.display === "none") {
        auditTrailContainer.style.display = "block";
        toggleIcon.classList.remove("fa-chevron-down");
        toggleIcon.classList.add("fa-chevron-up");
        toggleIcon.classList.add("rotate");
    } else {
        auditTrailContainer.style.display = "none";
        toggleIcon.classList.remove("fa-chevron-up");
        toggleIcon.classList.add("fa-chevron-down");
        toggleIcon.classList.remove("rotate");
    }
}
// clearSearchTicket function
function clearSearchTicket() {
    // Clear the ticket number input field
    document.getElementById("ticketNumber").value = "";
    // Hide the ticket results container
    document.getElementById("ticketResultsContainer").style.display = "none";
    // Clear any content inside the ticket results container
    document.getElementById("ticketResultsContainer").innerHTML = "";
    // Hide the 'not found' message
    document.getElementById("notfound").style.display = "none";
    // Clear and hide any result messages
    document.getElementById("RedultMessge").textContent = "";
    document.getElementById("RedultMessgeCont").style.display = "none";
    // Reset the URL to remove any query parameters or hash
    history.pushState("", document.title, window.location.pathname + window.location.search);
}
