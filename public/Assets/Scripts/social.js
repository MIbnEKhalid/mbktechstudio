// Define social media links
const socialMediaLinks = [
    { href: "https://instagram.com/mbktech.studios", icon: "fab fa-instagram", target: "_blank" },
    { href: "https://www.facebook.com/people/MBK-Tech-Studio/61559079077988/", icon: "fab fa-facebook-f", target: "_blank" },
    { href: "https://www.linkedin.com/in/muhammad-bin-khalid-89711b25b", icon: "fab fa-linkedin", target: "_blank" },
    { href: "https://x.com/ibnekhalid28", icon: "fab fa-twitter", target: "_blank" },
    { href: "https://github.com/MIbnEKhalid", icon: "fab fa-github", target: "_blank" },
    { href: "https://youtube.com/@mibnekhalid", icon: "fab fa-youtube", target: "_blank" },
    { href: "https://discord.gg/", icon: "fab fa-discord", target: "_blank" },
    { href: "https://signal.me/#eu/0Bxn3qmtp8gtYNuy6eJ_F3WaHWHrQW3uefaC2y01VCWtduFQCwJHvIFL6N4VOtsv", icon: "fa-brands fa-signal-messenger", target: "_blank" },
];

// Function to populate social media icons
function populateIcons(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return; // Ensure container exists
    container.innerHTML = ""; // Clear existing content
    socialMediaLinks.forEach(link => {
        const anchor = document.createElement("a");
        anchor.href = link.href;
        anchor.target = link.target;
        anchor.innerHTML = `<i class="${link.icon}"></i>`;
        container.appendChild(anchor);
    });
}

// Wait for DOM to load before executing
document.addEventListener("DOMContentLoaded", function() {
    populateIcons("media-icons"); // Populate media icons for "media-icons"
    populateIcons("media-icons-m"); // Populate media icons for "media-icons-m"

    // Populate icons for "ssmedia" if it exists
    const ssmediaElement = document.getElementById("ssmedia");
    if (ssmediaElement) {
        ssmediaElement.innerHTML = ""; // Clear existing content
        socialMediaLinks.forEach(link => {
            const anchor = document.createElement("a");
            anchor.href = link.href;
            anchor.target = link.target;
            anchor.innerHTML = `<i class="${link.icon}"></i>`;
            ssmediaElement.appendChild(anchor);
        });
    }
});