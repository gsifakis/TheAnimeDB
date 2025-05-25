import { fetchData, showAlert } from "./utils.js";
import { global, API_URL } from "./constants.js";
import { displayPageBtns, displayPagination } from "./pagination.js";

async function search() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    global.search.text = urlParams.get("search-text");
    global.search.type = urlParams.get("type");

    if (global.search.text === "" || global.search.text === null) {
        showAlert("Search cannot be empty");
    } else {
        const data = await fetchData(
            `${API_URL}${global.search.type}?q=${global.search.text}&page=${global.search.page}&sfw`
        );
        displaySearchRes(data);
    }
}

function displaySearchRes(data) {
    // Getting Search Results Container
    const searchResContainer = document.getElementById("search-results");
    searchResContainer.innerHTML = "";

    // Get Current Page num and total pages
    global.search.page = data.pagination.current_page;
    global.search.totalPages = data.pagination.last_visible_page;

    // Get Search REsults Grid
    const searchResultsGrid = document.createElement("div");
    searchResultsGrid.id = "search-results-grid";
    searchResultsGrid.classList.add("results-grid");
    searchResultsGrid.innerHTML = "";

    const searchFakeBody = document.getElementById("search-fake-body");
    searchFakeBody.style = "display:block";

    // console.log(data);

    // Total Results
    const resultsNumber = document.querySelector(".results-number");

    if (data.pagination.items.count !== 0) {
        resultsNumber.innerHTML = `${data.pagination.items.total} Results found for ${global.search.text}`;
    } else {
        resultsNumber.innerHTML = `No Results Found`;
    }

    // Search data

    data.data.forEach((el) => {
        const link = document.createElement("a");
        link.classList.add("card");
        link.href = `${global.search.type}-details.html?id=${el.mal_id}`;

        const title = document.createElement("h3");
        title.classList.add("title");
        let titleText = el.title_english || el.title;
        title.innerHTML = `${titleText}`;

        const img = document.createElement("img");
        img.classList.add("headshot-img");

        // img.title = `${el.title}`; Hover img property
        if (el.images.jpg.large_image_url !== null) {
            img.src = el.images.jpg.large_image_url;
        } else {
            img.src = "../images/no-image.png";
        }

        link.appendChild(img);
        link.appendChild(title);

        if (el.score !== null) {
            const rating = document.createElement("h4");
            rating.innerHTML = `<i class="fa-solid fa-star"></i> ${el.score.toFixed(
                1
            )}`;
            link.appendChild(rating);
        }
        searchFakeBody.style = "display:none";
        searchResultsGrid.appendChild(link);
        searchResContainer.appendChild(searchResultsGrid);
    });

    displayPageBtns();
    displayPagination();
}

export { search, displaySearchRes };
