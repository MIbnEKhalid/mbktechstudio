let products = [];
const productsContainer = document.querySelector(".products");
const searchInput = document.getElementById("searchProduct");
const categoryFilter = document.getElementById("categoryFilter");
const semesterFilter = document.getElementById("semesterFilter");
const spinner = document.getElementById('spinner');

async function loadProducts() {
  try {
    const response = await fetch('https://api.mbktechstudio.com/api/Unilib/Book');
    products = await response.json(); // Parse the JSON response directly
    spinner.style.display = 'none';
    filterProducts(); // Trigger initial filtering
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

function filterProducts() {
  const searchTerm = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const selectedSemester = semesterFilter.value;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm);
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSemester = !selectedSemester || product.semester === selectedSemester;
    return matchesSearch && matchesCategory && matchesSemester;
  });

  // Sort the filtered products to show "All" first
  filteredProducts.sort((a, b) => {
    if (a.name === "All") return -1;
    if (b.name === "All") return 1;
    return 0;
  });

  displayProducts(filteredProducts);
}

function displayProducts(productsArray) {
  productsContainer.innerHTML = ''; // Clear previous products
  if (productsArray.length === 0) {
    productsContainer.innerHTML = '<p>No material found</p>';
    return;
  }

  productsArray.forEach((product) => {
    const productElement = document.createElement("a");
    productElement.classList.add("product", "linked");
    productElement.id = product.id;
    productElement.href = product.link;
    productElement.innerHTML = `
           <img src="Assets/Images/BookCovers/${product.imageURL}" alt="${product.name}">
           <h3>${product.name}</h3>
           <p>${product.description}</p>
    `    ;
    productsContainer.appendChild(productElement);
  });
}

// Attach event listeners
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  // Filter when dropdowns or search input change
  searchInput.addEventListener("input", filterProducts);
  categoryFilter.addEventListener("change", filterProducts);
  semesterFilter.addEventListener("change", filterProducts);
});


fetch("https://api.mbktechstudio.com/api/Unilib/QuizAss")
  .then((response) => response.json()) // Fetch the JSON data
  .then((data) => {
    const detailsContainer = document.getElementById("detailsContainer");
    const noAss = document.getElementById("noAss");

    detailsContainer.innerHTML = ""; // Clear any existing content

    // Get the current date without the time component
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

    let activeItems = 0;

    data.forEach((item) => {
      const dueDate = new Date(item.dueDate);
      dueDate.setHours(0, 0, 0, 0); // Strip time for comparison

      // Check if the dueDate is today or in the future
      if (dueDate >= currentDate) {
        activeItems++;

        const detailsDiv = document.createElement("div");
        detailsDiv.classList.add("details");
        detailsDiv.id = `details-${activeItems}`;
        detailsDiv.style.minWidth = "100%";
        detailsDiv.style.width = "100%";

        // Truncate long descriptions
        const shortDescription = item.description.substring(0, 100);
        const isTruncated = item.description.length > 100;

        detailsDiv.innerHTML = `
                    <div class="date-box">
                        <span id="issueDate">${item.issueDate}</span>
                        <span id="dueDate">${item.dueDate}</span>
                    </div>
                    <div class="assignment-info">
                        <span>
                            <strong>${item.subject}:</strong>
                            <span class="description">${shortDescription}</span>
                              ${isTruncated
            ? `<span class="see-more">...</span><button class="toggle-more-inline">+ See More</button>`
            : ""
          }
                            </span>
                    </div>
                `;

        detailsContainer.appendChild(detailsDiv);

        if (isTruncated) {
          const toggleButton = detailsDiv.querySelector(".toggle-more-inline");
          const descriptionSpan = detailsDiv.querySelector(".description");
          const seeMoreSpan = detailsDiv.querySelector(".see-more");

          toggleButton.addEventListener("click", () => {
            if (descriptionSpan.textContent === shortDescription) {
              descriptionSpan.textContent = item.description;
              seeMoreSpan.style.display = "none";
              toggleButton.textContent = "- See Less";
            } else {
              descriptionSpan.textContent = shortDescription;
              seeMoreSpan.style.display = "inline";
              toggleButton.textContent = "+ See More";
            }
          });
        }
      }
    });

    // Handle cases where no active items exist
    if (activeItems === 0) {
      detailsContainer.style.display = "none";
      noAss.style.display = "block";
      document.getElementById("toggleButton").style.display = "none";
    } else {
      detailsContainer.style.display = "block";
      noAss.style.display = "none";
      document.getElementById("toggleButton").style.display = "block";
    }
  })
  .catch((error) => console.error("Error fetching data:", error));