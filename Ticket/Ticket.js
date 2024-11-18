

document.addEventListener("DOMContentLoaded", function () {

    const ticketParam = getUrlParameter('Ticket') || getUrlParameter('ticket');
    if (ticketParam && ticketParam.length === 10) {
        showbox('tS-form');
        document.getElementById('ticketId').value = ticketParam;
        document.getElementById('ticketStatusForm').dispatchEvent(new Event('submit'));
    }
});

// Get URL parameter value by name
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

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





document.getElementById('ticketStatusForm').addEventListener('submit', function (event) {
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
