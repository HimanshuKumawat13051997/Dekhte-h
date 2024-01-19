$(document).ready(function () {
  // Check if userFound is available in localStorage
  let userFound = JSON.parse(localStorage.getItem("userFound"));

  function showLoader() {
    $(".spinner-border").show();
  }

  // Hide loader
  function hideLoader() {
    $(".spinner-border").hide();
  }

  let secondurl = userFound.url;

  $.ajax({
    url: secondurl,
    method: "GET",
    dataType: "json",
    success: function (data) {
      $("#imgid").attr("src", data.avatar_url);
      $(".profile span").text(data.html_url);
      $(".profileside h1").text(data.name);
      $(".profileside span:eq(0)").text(data.bio ? data.bio : "No Present");
      $(".profileside span:eq(1)").text(data.location);
      $(".profileside span:eq(2)").text(
        data.twitter_username ? data.twitter_username : "Not Present"
      );
      // localStorage.removeItem("userFound");
    },
    error: function () {
      alert("User information not found");
    },
  });

  async function fetchData(page, itemsPerPage) {
    // Assuming you have an API endpoint for fetching data
    const apiUrl = `${userFound.repos_url}?page=${page}&per_page=${itemsPerPage}`;

    return await fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => data);
  }

  async function totalnumberPage() {
    const apiaUrl = userFound.repos_url;
    return await fetch(apiaUrl)
      .then((response) => response.json())
      .then((data) => data.length);
  }
  // Display data on the page
  function displayData(data) {
    $(".forpagerender").empty();
    data.map((item) => {
      $(".forpagerender").append(`<div class="maincard">
    <h1>${item.name}</h1>
    <h2>${item.description}</h2>
    <span class="badge text-bg-primary">Primary</span>
  </div>`);
    });
  }

  // Pagination logic
  let currentPage = 1;
  const itemsPerPage = 10; // Adjust this based on the number of items per page
  let totalItems;
  let totalPages;

  function createNumericButtons() {
    const paginationContainer = document.getElementById("numericPagination");

    // Clear existing buttons
    paginationContainer.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement("button");
      button.classList.add("page-link");
      button.innerText = i;
      button.addEventListener("click", () => {
        loadPage(i);
        updateActiveClass(i);
      });
      paginationContainer.appendChild(button);
    }
    updateActiveClass(currentPage);
  }

  function updateNumericButtons() {
    const numericButtons =
      document.getElementById("numericPagination").children;
    for (let i = 0; i < numericButtons.length; i++) {
      numericButtons[i].classList.toggle("active", i + 1 === currentPage);
    }
  }

  function updatePaginationButtons() {
    document.getElementById("prevButton").disabled = currentPage === 1;
    // You should have a way to determine the total number of pages from your server response
    // In this example, assuming total pages are hardcoded to 5
    document.getElementById("nextButton").disabled = currentPage === totalPages;
    updateNumericButtons();
  }
  showLoader();
  function loadPage(pageNumber) {
    // Check if the requested page is within valid bounds
    if (pageNumber >= 1 && (!totalPages || pageNumber <= totalPages)) {
      totalnumberPage() // Call totalnumberPage to get the total number of items
        .then((totalCount) => {
          totalItems = totalCount;
          totalPages = Math.ceil(totalItems / itemsPerPage);
          createNumericButtons();
          return fetchData(pageNumber, itemsPerPage);
        });
      fetchData(pageNumber, itemsPerPage)
        .then((data) => {
          displayData(data);
          currentPage = pageNumber;
          updatePaginationButtons();
        })
        .catch((error) => console.error("Error fetching data:", error))
        .finally(() => {
          hideLoader();
        });
    }
  }

  // Event listeners for pagination buttons
  document
    .getElementById("prevButton")
    .addEventListener("click", () => loadPage(currentPage - 1));
  document
    .getElementById("nextButton")
    .addEventListener("click", () => loadPage(currentPage + 1));

  // Initial data load
  loadPage(currentPage);
});
