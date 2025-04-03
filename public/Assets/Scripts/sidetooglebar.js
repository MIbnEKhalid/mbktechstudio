const sidebar = document.getElementById("sidebar");
const stoggleButton = document.getElementById("sidebar-toggle");
const toggleIcon = stoggleButton.querySelector("i");

stoggleButton.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar-collapsed");

    if (sidebar.classList.contains("sidebar-collapsed")) {
        toggleIcon.classList.remove("fa-chevron-right");
        toggleIcon.classList.add("fa-chevron-left");
    } else {
        toggleIcon.classList.remove("fa-chevron-left");
        toggleIcon.classList.add("fa-chevron-right");
    }
});