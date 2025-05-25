import { search } from "./src/search.js";
import { highlightActiveLink, displayMobileMenu } from "./src/utils.js";
import { global } from "./src/constants.js";
import displayDetails from "./src/display_details.js";
import { displayAllSwipers } from "./src/swipers.js";
import displayRecommended from "./src/display_my_recommendations.js";

function init() {
    switch (global.currentPage) {
        case "/":
        case "/index.html":
            displayAllSwipers("anime");
            break;
        case "/manga.html":
            displayAllSwipers("manga");
            break;
        case "/anime-details.html":
            displayDetails("anime");
            break;
        case "/manga-details.html":
            displayDetails("manga");
            break;
        case "/my-recommendations.html":
            displayRecommended("anime");
            displayRecommended("manga");
            break;
        case "/search.html":
            search();
            break;
    }

    highlightActiveLink();
    displayMobileMenu();
}

window.addEventListener("DOMContentLoaded", init);
