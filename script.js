const global = {
    currentPage: window.location.pathname,
    search: {
        text: "",
        type: "",
        page: 1,
        totalPages: 1,
    },
};

// Urls
const swiperURLS = {
    topPopularAnime:
        "https://api.jikan.moe/v4/top/anime?type=tv&filter=bypopularity",
    topPopularAnimeMovies:
        "https://api.jikan.moe/v4/top/anime?type=movie&filter=bypopularity",
    topAiringAnime: "https://api.jikan.moe/v4/top/anime?type=tv&filter=airing",
    topUpcomingAnime:
        "https://api.jikan.moe/v4/top/anime?type=tv&filter=upcoming",
    topPopularManga:
        "https://api.jikan.moe/v4/top/manga?type=manga&filter=bypopularity",
    topPopularManhwa:
        "https://api.jikan.moe/v4/top/manga?type=manhwa&filter=bypopularity",
    topPopularManhua:
        "https://api.jikan.moe/v4/top/manga?type=manhua&filter=bypopularity",
};

const localRecPath = "../recommendations/";
const API_URL = "https://api.jikan.moe/v4/";

// Classes, divs etc

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterData(data) {
    const filteredData = Array.from(new Set(data.map((a) => a.mal_id))).map(
        (mal_id) => {
            return data.find((a) => a.mal_id === mal_id);
        }
    );

    return filteredData;
}

async function fetchData(path) {
    try {
        const response = await fetch(path);
        if (response.ok) {
            return (resData = await response.json());
        } else {
            if (response.status === 404) {
                throw new Error("404, Not found");
            } else if (response.status === 500) {
                throw new Error("500, Internal Server Error");
            } else {
                throw new Error(response.status, "Sth went wrong");
            }
        }
    } catch (error) {
        console.error("Fetch", error);
    }
}

// async function displayAnimeDetails() {
//     const data = await fetchData("../recommendations/anime.json");
//     const desc = data.synopsis;
//     // desc.replace("[Written by MAL Rewrite]", "");
//     const details = document.querySelector(".details-description");
//     details.innerHTML = `${desc
//         .split("[Written by MAL Rewrite]")
//         .join("")
//         .replaceAll("\n", "<br>")}`;

//     console.log(desc);
//     console.log(data);
// }

async function displayDetails(type) {
    const id = window.location.search.split("=")[1];
    const { data } = await fetchData(`${API_URL}${type}/${id}`);
    console.log(data);
    // getting the image
    const detailsLeft = document.querySelector(".details-left");
    const image = document.createElement("img");
    image.classList.add("left-image");
    if (data.images.jpg.large_image_url !== null) {
        image.src = data.images.jpg.large_image_url;
    } else {
        image.src = "../images/no-image.png";
    }

    // Making the yt and myanimelist btns
    const btnsContainer = document.createElement("div");
    btnsContainer.classList.add("btn-container");

    const malBtn = document.createElement("a");
    malBtn.target = "_blank";
    malBtn.href = data.url;
    const malBtnImg = document.createElement("img");
    malBtnImg.classList.add("image-btn");
    malBtnImg.src = "../../images/MyAnimeList_Logo.png";
    malBtn.appendChild(malBtnImg);
    btnsContainer.appendChild(malBtn);

    if (type === "anime" && data.trailer.url !== null) {
        const ytBtn = document.createElement("a");
        ytBtn.target = "_blank";
        ytBtn.href = data.trailer.url;
        const ytBtnImg = document.createElement("img");
        ytBtnImg.classList.add("image-btn");
        ytBtnImg.src = "../../images/yt.png";
        ytBtn.appendChild(ytBtnImg);
        btnsContainer.appendChild(ytBtn);
    }

    btnsContainer.appendChild(malBtn);

    // Appending final childs
    detailsLeft.appendChild(image);
    detailsLeft.appendChild(btnsContainer);

    // Adding Title and desc etc
    const detailsRight = document.querySelector(".details-right");
    const elTitle = document.createElement("h2");
    elTitle.classList.add("details-title");
    elTitle.innerHTML = `${data.title_english || data.title}`;

    // second title
    const secondTitle = document.createElement("h3");
    secondTitle.classList.add("details-second-title");
    if (type === "anime") {
        const episodes = data.episodes;
        secondTitle.innerHTML = `${data.status} - ${
            episodes === 1 ? episodes + " Ep" : episodes + " Eps"
        } - ${data.duration} - ${data.rating}`;
    } else {
        secondTitle.innerHTML = `${data.status}`;
    }

    // Genres Title
    const genresTitle = document.createElement("h3");
    genresTitle.classList.add("details-genres-title");
    genresTitle.innerHTML = "Genres";

    // genres List
    const genresList = document.createElement("ul");
    genresList.classList.add("details-genres-list");
    data.genres.forEach((genre, index) => {
        console.log(data.genres.length - 1);
        console.log(index, genre);
        const genreItem = document.createElement("li");

        if (index === data.genres.length - 1) {
            genreItem.innerHTML = `${genre.name}`;
        } else {
            genreItem.innerHTML = `${genre.name}\xa0\xa0`;
        }
        genresList.appendChild(genreItem);
    });

    // description
    const detailsParagraph = document.createElement("p");
    detailsParagraph.classList.add("details-description");
    // Removing some \n and [Written by MAL Rewrite]
    const synopsis = data.synopsis
        .replaceAll("\n", "<br>")
        .split("[Written by MAL Rewrite]")
        .join("");
    detailsParagraph.innerHTML = synopsis;

    // Appending childs
    detailsRight.appendChild(elTitle);
    detailsRight.appendChild(secondTitle);
    detailsRight.appendChild(genresTitle);
    detailsRight.appendChild(genresList);
    detailsRight.appendChild(detailsParagraph);

    swiperURLS.similarAnime = `https://api.jikan.moe/v4/${type}/${id}/recommendations`;

    displaySwiperDetailsRecommended(
        `${type}`,
        `https://api.jikan.moe/v4/${type}/${id}/recommendations`
    );
}

async function displayRecommended(type) {
    const myType = document.getElementById(`my-${type}`);

    const { data } = await fetchData(
        `${localRecPath}${type}-recommendations.json`
    );

    for (el of data) {
        const link = document.createElement("a");
        link.classList.add("card");
        link.href = `${type}-details.html?id=${el.mal_id}`;

        const title = document.createElement("h3");
        title.classList.add("title");
        let titleText = el.title_english || el.title;
        title.innerHTML = `${titleText}`;

        const img = document.createElement("img");
        img.classList.add("headshot-img");
        img.src = `${el.images.jpg.large_image_url}`;
        // img.title = `${el.title}`; Hover img property

        const rating = document.createElement("h4");
        rating.innerHTML = `<i class="fa-solid fa-star"></i> ${el.score.toFixed(
            1
        )}`;

        link.appendChild(img);
        link.appendChild(title);
        link.appendChild(rating);
        myType.appendChild(link);
    }
}

// Search Functions

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

    for (el of data.data) {
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
    }
    displayPageBtns();
    displayPagination();
}

// Creating the page Btns
function createPageBtn(num) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("page-btn", "page-num");
    pageBtn.innerHTML = `${num}`;
    return pageBtn;
}

function createPageDots() {
    const paginationContainer = document.getElementById("pagination");
    const pageBtnDots = document.createElement("button");
    pageBtnDots.classList.add("dots");
    pageBtnDots.innerHTML = `...`;
    paginationContainer.appendChild(pageBtnDots);
    return pageBtnDots;
}

function displayPageBtns() {
    // Getting Search Res Container
    const searchResContainer = document.getElementById("search-results");

    const paginationContainer = document.createElement("div");
    paginationContainer.id = "pagination";
    // Add pagination container to results
    searchResContainer.appendChild(paginationContainer);
    // Emptying Page container before each btn display
    paginationContainer.innerHTML = "";

    // Create Prev and next Btns
    const prevBtn = document.createElement("button");
    prevBtn.classList.add("page-btn");
    prevBtn.id = "prev";
    prevBtn.innerHTML = `<i class="fa-solid fa-arrow-left fa-xl"></i>`;

    const nextBtn = document.createElement("button");
    nextBtn.classList.add("page-btn");
    nextBtn.id = "next";
    nextBtn.innerHTML = `<i class="fa-solid fa-arrow-right fa-xl"></i>`;

    // Adding Prev Btn to pagination container
    paginationContainer.appendChild(prevBtn);
    if (global.search.page === 1) {
        prevBtn.classList.add("page-btn-disabled");
        document.getElementById("prev").disabled = true;
    }

    // Pages Remaining
    const pagesRemaining = global.search.totalPages - global.search.page;

    let i;
    if (global.search.totalPages <= 5) {
        console.log(global.search);
        for (i = 0; i < global.search.totalPages; i++) {
            const pageBtn = createPageBtn(i + 1);
            if (i + 1 === global.search.page) {
                pageBtn.classList.add("page-btn-active");
            }
            paginationContainer.appendChild(pageBtn);
        }
    } else {
        console.log(global.search);
        // Adding first page btn
        const firstPageBtn = createPageBtn(1);
        if (global.search.page === 1) {
            firstPageBtn.classList.add("page-btn-active");
        }
        paginationContainer.appendChild(firstPageBtn);

        if (global.search.page <= 3) {
            for (i = 1; i < 3; i++) {
                const pageBtn = createPageBtn(i + 1);
                if (i + 1 === global.search.page) {
                    pageBtn.classList.add("page-btn-active");
                }

                paginationContainer.appendChild(pageBtn);
            }
            if (global.search.page === 3) {
                const nextPageBtn = createPageBtn(global.search.page + 1);
                paginationContainer.appendChild(nextPageBtn);
            }
            // Adding Dots
            createPageDots();
        } else if (pagesRemaining < 3) {
            // Adding Dots
            createPageDots();

            // First Iteration counter
            let firstIteration = true;
            let firstIteration2 = true;
            for (i = 0; i < pagesRemaining; i++) {
                const pageBtn = createPageBtn(global.search.page + i);
                if (firstIteration) {
                    pageBtn.classList.add("page-btn-active");
                    firstIteration = false;
                }

                if (pagesRemaining === 2 && firstIteration2) {
                    firstIteration2 = false;
                    const pageBtnPrev = createPageBtn(global.search.page - 1);
                    paginationContainer.appendChild(pageBtnPrev);
                    console.log("flag");
                }

                if (pagesRemaining === 1) {
                    const pageBtnPrev = createPageBtn(global.search.page - 1);
                    paginationContainer.appendChild(pageBtnPrev);
                    console.log("flag");
                }

                paginationContainer.appendChild(pageBtn);
            }
        } else {
            // Adding Dots
            createPageDots();

            // Creating PageBtn Prev
            const pageBtnPrev = createPageBtn(global.search.page - 1);
            paginationContainer.appendChild(pageBtnPrev);

            // Creating PageBtn
            const pageBtn = createPageBtn(global.search.page);
            pageBtn.classList.add("page-btn-active");
            paginationContainer.appendChild(pageBtn);

            // Creating PageBtnNext
            const pageBtnNext = createPageBtn(global.search.page + 1);
            paginationContainer.appendChild(pageBtnNext);

            // Adding Dots
            createPageDots();
        }

        // Adding last page btn
        const lastPageBtn = createPageBtn(global.search.totalPages);
        if (global.search.totalPages === global.search.page) {
            // Adding second from last Page
            const pageBtnPrev1 = createPageBtn(global.search.page - 2);
            paginationContainer.appendChild(pageBtnPrev1);

            // Adding previous from last page
            const pageBtnPrev2 = createPageBtn(global.search.page - 1);
            paginationContainer.appendChild(pageBtnPrev2);

            lastPageBtn.classList.add("page-btn-active");
        }

        paginationContainer.appendChild(lastPageBtn);
    }

    // Appending next button in the end
    paginationContainer.appendChild(nextBtn);
    if (global.search.page === global.search.totalPages) {
        nextBtn.classList.add("page-btn-disabled");
        document.getElementById("next").disabled = true;
    }

    searchResContainer.appendChild(paginationContainer);
}

async function pageNextClick() {
    global.search.page++;
    const data = await fetchData(
        `${API_URL}${global.search.type}?q=${global.search.text}&page=${global.search.page}`
    );

    displaySearchRes(data);
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

async function pagePrevClick() {
    global.search.page--;
    const data = await fetchData(
        `${API_URL}${global.search.type}?q=${global.search.text}&page=${global.search.page}`
    );

    displaySearchRes(data);
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

async function numPageClick(text) {
    global.search.page = text;
    console.log(global.search.page);
    const data = await fetchData(
        `${API_URL}${global.search.type}?q=${global.search.text}&page=${global.search.page}`
    );

    displaySearchRes(data);
    globalThis.scrollTo({ top: 0, left: 0, behavior: "smooth" });
}

function displayPagination() {
    document.getElementById("next").addEventListener("click", pageNextClick);
    document.getElementById("prev").addEventListener("click", pagePrevClick);

    const allPageNums = document.querySelectorAll(".page-num");

    allPageNums.forEach((num) => {
        num.addEventListener("click", () => {
            numPageClick(num.innerHTML);
        });
    });
}

function showAlert(message) {
    const alertEl = document.createElement("div");
    alertEl.classList.add("alert");
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector("#alert").appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 2000);
}

// Swipper Thingies
async function displaySwiperDetailsRecommended(type, path) {
    await delay(1500);
    const { data } = await fetchData(path);

    for (let i = 0; i < Math.min(data.length, 30); i++) {
        const div = document.createElement("div");
        div.classList.add("swiper-slide");

        const swiperLink = document.createElement("a");
        swiperLink.href = `${type}-details.html?id=${data[i].entry.mal_id}`;

        const swiperImg = document.createElement("img");
        if (data[i].entry.images.jpg.large_image_url !== null) {
            swiperImg.src = `${data[i].entry.images.jpg.large_image_url}`;
        } else {
            swiperImg.src = "../images/no-image.png";
        }
        // swiperImg.title = `${element.title}`;

        const title = document.createElement("h3");
        title.classList.add("swiper-title");
        title.innerHTML = `${
            data[i].entry.title_english || data[i].entry.title
        }`;

        swiperLink.appendChild(swiperImg);
        swiperLink.appendChild(title);
        div.appendChild(swiperLink);

        document.querySelector(".details-recommended").appendChild(div);
    }
    initSwiper();
}

async function displaySwiper(type, path) {
    const { data } = await fetchData(path);

    // filtering for duplicate data

    filterData(data).forEach((element) => {
        const div = document.createElement("div");
        div.classList.add("swiper-slide");

        const swiperLink = document.createElement("a");
        swiperLink.href = `${type}-details.html?id=${element.mal_id}`;

        const swiperImg = document.createElement("img");
        swiperImg.src = `${element.images.jpg.large_image_url}`;
        // swiperImg.title = `${element.title}`;

        const title = document.createElement("h3");
        title.classList.add("swiper-title");
        title.innerHTML = `${element.title_english || element.title}`;

        swiperLink.appendChild(swiperImg);
        swiperLink.appendChild(title);
        div.appendChild(swiperLink);

        let wrapper;
        switch (path) {
            case swiperURLS.topPopularAnime:
                wrapper = document.querySelector(".top-tv-bypopularity");
                break;
            case swiperURLS.topPopularAnimeMovies:
                wrapper = document.querySelector(".top-movie-bypopularity");
                break;
            case swiperURLS.topAiringAnime:
                wrapper = document.querySelector(".top-tv-airing");
                break;
            case swiperURLS.topUpcomingAnime:
                wrapper = document.querySelector(".top-tv-upcoming");
                break;
            case swiperURLS.topPopularManga:
                wrapper = document.querySelector(".top-manga-bypopularity");
                break;
            case swiperURLS.topPopularManhwa:
                wrapper = document.querySelector(".top-manhwa-bypopularity");
                break;
            case swiperURLS.topPopularManhua:
                wrapper = document.querySelector(".top-manhua-bypopularity");
                break;
            case swiperURLS.similarAnime:
                wrapper = document.querySelector(".details-recommended");
        }

        wrapper.appendChild(div);
    });
    initSwiper();
}

async function displayAllSwipers(type) {
    const hero = document.querySelector(".hero");
    const heroLoading = document.querySelector(".hero-loading");

    if (type === "anime") {
        await delay(1500);
        displaySwiper("anime", swiperURLS.topPopularAnime);
        displaySwiper("anime", swiperURLS.topPopularAnimeMovies);
        await delay(1500);
        displaySwiper("anime", swiperURLS.topAiringAnime);
        displaySwiper("anime", swiperURLS.topUpcomingAnime);
    } else {
        displaySwiper("manga", swiperURLS.topPopularManga);
        displaySwiper("manga", swiperURLS.topPopularManhwa);
        await delay(1200);
        displaySwiper("manga", swiperURLS.topPopularManhua);
    }

    hero.classList.add("visible");
    heroLoading.classList.add("hidden");
}

function initSwiper() {
    const swiper = new Swiper(".swiper", {
        slidesPerView: 1,
        spaceBetween: 15,
        freeMode: true,
        loop: false,
        autoplay: false,
        breakpoints: {
            400: {
                slidesPerView: 2,
            },
            558: {
                slidesPerView: 3,
            },
            700: {
                slidesPerView: 4,
            },
            968: {
                slidesPerView: 5,
            },
            1200: {
                slidesPerView: 6,
            },
            1400: {
                slidesPerView: 7,
            },
        },
    });
}

function displayMenu() {
    const mobileMenuToggle = document.querySelector(".mobile-menu-icon");
    const mobileMenuItems = document.querySelector(".mobile-menu-items");
    const body = document.getElementsByTagName("body")[0];
    const blurAll = document.querySelectorAll(".blur");

    mobileMenuToggle.addEventListener("click", () => {
        mobileMenuItems.classList.toggle("active");
        blurAll.forEach((i) => {
            i.classList.toggle("blur-active");
        });
        body.classList.toggle("overflow-y");
    });
}

function highlightActiveLink() {
    const links = document.querySelectorAll(".nav-link");
    links.forEach((link) => {
        if (link.getAttribute("href") === global.currentPage) {
            link.classList.add("active-color");
            link.parentElement.classList.add("active");
        }
    });
}

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
    displayMenu();
}

window.addEventListener("DOMContentLoaded", init);
