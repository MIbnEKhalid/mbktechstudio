// Global state
const state = {
  products: [],
  filteredProducts: [],
  assignments: [],
  activeAssignments: 0
};

// DOM elements
const elements = {
  productsContainer: document.querySelector(".products"),
  searchInput: document.getElementById("searchProduct"),
  categoryFilter: document.getElementById("categoryFilter"),
  semesterFilter: document.getElementById("semesterFilter"),
  spinner: document.getElementById('spinner'),
  detailsContainer: document.getElementById("detailsContainer"),
  noAss: document.getElementById("noAss"),
  toggleButton: document.getElementById("toggleButton"),
  clearBtn: document.getElementById("clearSearch")
};

// Initialize the application
document.addEventListener("DOMContentLoaded", initApp);

async function initApp() {
  setupEventListeners();
  await loadProducts();
  await loadAssignments();
}

function setupEventListeners() {
  // Filter events
  elements.searchInput.addEventListener("input", debounce(filterProducts, 300));
  elements.categoryFilter.addEventListener("change", filterProducts);
  elements.semesterFilter.addEventListener("change", filterProducts);

  // Clear search
  elements.clearBtn.addEventListener("click", () => {
    elements.searchInput.value = '';
    elements.clearBtn.style.display = 'none';
    filterProducts();
  });

  // Toggle assignments
  elements.toggleButton.addEventListener("click", toggleAssignments);

  // Sidebar navigation
  document.querySelectorAll('aside a').forEach(anchor => {
    anchor.addEventListener("click", smoothScroll);
  });
}

// Data loading functions
async function loadProducts() {
  try {
    const response = await fetch('https://api.mbktechstudio.com/api/Unilib/Book');
    state.products = await response.json();
    elements.spinner.style.display = 'none';
    filterProducts();
  } catch (error) {
    console.error("Error loading products:", error);
    showError("Failed to load course materials. Please try again later.");
  }
}

async function loadAssignments() {
  try {
    const response = await fetch("https://api.mbktechstudio.com/api/Unilib/QuizAss");
    state.assignments = await response.json();
    renderAssignments();
  } catch (error) {
    console.error("Error loading assignments:", error);
    showError("Failed to load assignments. Please try again later.");
  }
}

// Rendering functions
function filterProducts() {
  const searchTerm = elements.searchInput.value.toLowerCase();
  const selectedCategory = elements.categoryFilter.value;
  const selectedSemester = elements.semesterFilter.value;

  state.filteredProducts = state.products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSemester = !selectedSemester || product.semester === selectedSemester;
    return matchesSearch && matchesCategory && matchesSemester;
  });

  // Show/hide clear button
  elements.clearBtn.style.display = searchTerm.length > 0 ? 'block' : 'none';

  // Sort with "All" first
  state.filteredProducts.sort((a, b) => {
    if (a.name === "All") return -1;
    if (b.name === "All") return 1;
    return 0;
  });

  renderProducts();
}

function renderProducts() {
  elements.productsContainer.innerHTML = '';

  if (state.filteredProducts.length === 0) {
    elements.productsContainer.innerHTML = '<p class="no-results">No materials found matching your criteria</p>';
    return;
  }

  const fragment = document.createDocumentFragment();

  state.filteredProducts.forEach(product => {
    const productElement = createProductCard(product);
    fragment.appendChild(productElement);
  });

  elements.productsContainer.appendChild(fragment);
}

function createProductCard(product) {
  const card = document.createElement("article");
  card.classList.add("book-card", "linked");
  card.id = product.id;

  if (product.main) {
    card.innerHTML += `<div class="badge" aria-label="Main resource">Main</div>`;
  }

  card.innerHTML += `
        <a href="${product.link}" aria-label="${product.name}"> 
          <img src="Assets/Images/BookCovers/${product.imageURL}" alt="Cover of ${product.name}" loading="lazy">
        </a>
        <div class="Bdetails">
          <h3>${product.name}</h3>
          <p>${product.description}</p>
        </div>
        <div class="actions">
          <a href="${product.link}" class="btn btn-save" aria-label="View ${product.name}">
            <i class="fas fa-eye" aria-hidden="true"></i> View
          </a>
          <button onclick="downloadResource('${product.link}')" class="btn btn-save" aria-label="Download ${product.name}">
            <i class="fas fa-download" aria-hidden="true"></i> Download
          </button>
        </div>
      `;

  return card;
}

function renderAssignments() {
  elements.detailsContainer.innerHTML = "";
  state.activeAssignments = 0;

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const fragment = document.createDocumentFragment();

  state.assignments.forEach(item => {
    const dueDate = new Date(item.dueDate);
    dueDate.setHours(0, 0, 0, 0);

    if (dueDate >= currentDate) {
      state.activeAssignments++;
      const assignmentElement = createAssignmentCard(item);
      fragment.appendChild(assignmentElement);
    }
  });

  elements.detailsContainer.appendChild(fragment);
  updateAssignmentVisibility();
}

function createAssignmentCard(item) {
  const detailsDiv = document.createElement("article");
  detailsDiv.classList.add("details");
  detailsDiv.id = `details-${state.activeAssignments}`;

  const shortDescription = item.description.substring(0, 100);
  const isTruncated = item.description.length > 100;

  detailsDiv.innerHTML = `
        <div class="date-box">
          <span id="issueDate"><strong>Issued:</strong> ${item.issueDate}</span>
          <span id="dueDate"><strong>Due:</strong> ${item.dueDate}</span>
        </div>
        <div class="assignment-info">
          <span>
            <strong>${item.subject}:</strong>
            <span class="description">${shortDescription}</span>
            ${isTruncated ?
      `<span class="see-more">...</span>
              <button class="toggle-more-inline" aria-expanded="false">+ See More</button>` : ''}
          </span>
        </div>
      `;

  if (isTruncated) {
    const toggleButton = detailsDiv.querySelector(".toggle-more-inline");
    const descriptionSpan = detailsDiv.querySelector(".description");
    const seeMoreSpan = detailsDiv.querySelector(".see-more");

    toggleButton.addEventListener("click", () => {
      const expanded = toggleButton.getAttribute("aria-expanded") === "true";
      toggleButton.setAttribute("aria-expanded", !expanded);

      if (expanded) {
        descriptionSpan.textContent = shortDescription;
        seeMoreSpan.style.display = "inline";
        toggleButton.textContent = "+ See More";
      } else {
        descriptionSpan.textContent = item.description;
        seeMoreSpan.style.display = "none";
        toggleButton.textContent = "- See Less";
      }
    });
  }

  return detailsDiv;
}

function updateAssignmentVisibility() {
  if (state.activeAssignments === 0) {
    elements.detailsContainer.style.display = "none";
    elements.noAss.style.display = "block";
    elements.toggleButton.style.display = "none";
  } else {
    elements.detailsContainer.style.display = "block";
    elements.noAss.style.display = "none";
    elements.toggleButton.style.display = "block";
  }
}

// Utility functions
function toggleAssignments() {
  const expanded = elements.detailsContainer.classList.toggle("expanded");
  elements.toggleButton.setAttribute("aria-expanded", expanded);
  elements.toggleButton.textContent = expanded ? "Show Less" : "Show More";
}

function downloadResource(driveLink) {
  const fileIdMatch = driveLink.match(/\/d\/([a-zA-Z0-9_-]+)/) || driveLink.match(/id=([a-zA-Z0-9_-]+)/);
  const fileId = fileIdMatch ? fileIdMatch[1] : null;
  if (fileId) {
    window.location.href = `https://drive.usercontent.google.com/uc?id=${fileId}&export=download`;
  }
  console.error("Invalid Google Drive link:", driveLink);
}

function smoothScroll(e) {
  e.preventDefault();
  const targetId = this.getAttribute("href").substring(1);
  const targetElement = document.getElementById(targetId);
  if (targetElement) {
    const headerHeight = document.querySelector("header").offsetHeight;
    const targetPosition = targetElement.offsetTop - headerHeight - 28;
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  }
}

function debounce(func, wait) {
  let timeout;
  return function () {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

function showError(message) {
  const errorElement = document.createElement("div");
  errorElement.classList.add("notification", "is-error");
  errorElement.textContent = message;
  document.querySelector(".not").appendChild(errorElement);
  setTimeout(() => errorElement.remove(), 5000);
}
