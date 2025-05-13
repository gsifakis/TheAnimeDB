const global = {
    currentPage: window.location.pathname,
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
const localAnime = "../recommendations/anime-recommendations.json";
const localManga = "../recommendations/manga-recommendations.json";

// Classes, divs etc

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

async function displayAnimeDetails() {
    const data = await fetchData("../recommendations/anime.json");
    const desc = data.synopsis;
    // desc.replace("[Written by MAL Rewrite]", "");
    const details = document.querySelector(".details-description");
    details.innerHTML = `${desc
        .split("[Written by MAL Rewrite]")
        .join("")
        .replaceAll("\n", "<br>")}`;

    console.log(desc);
    console.log(data);
}

async function displayDetails(type) {
    const id = window.location.search.split("=")[1];
    const { data } = await fetchData(`${API_URL}${type}/${id}`);

    console.log(data);

    // getting the image
    const detailsLeft = document.querySelector(".details-left");
    const image = document.createElement("img");
    image.classList.add("left-image");
    image.src = data.images.jpg.large_image_url;

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

    if (type === "anime") {
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
    data.genres.forEach((genre) => {
        const genreItem = document.createElement("li");
        genreItem.innerHTML = `${genre.name}\u00A0`;
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
    const creators = document.getElementById(`my-${type}`);

    const { data } = await fetchData(
        `${localRecPath}${type}-recommendations.json`
    );

    for (el of data) {
        const link = document.createElement("a");
        link.classList.add("card");
        link.href = `${type}-details.html?id=${el.mal_id}`;
        link.target = "_blank";

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
        creators.appendChild(link);
    }
}

// Swipper Thingies
async function displaySwiperDetailsRecommended(type, path) {
    const { data } = await fetchData(path);
    console.log(data);

    for (let i = 0; i < Math.min(data.length, 30); i++) {
        const div = document.createElement("div");
        div.classList.add("swiper-slide");

        const swiperLink = document.createElement("a");
        swiperLink.href = `${type}-details.html?id=${data[i].entry.mal_id}`;

        const swiperImg = document.createElement("img");
        swiperImg.src = `${data[i].entry.images.jpg.large_image_url}`;
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
    const filteredData = Array.from(new Set(data.map((a) => a.mal_id))).map(
        (mal_id) => {
            return data.find((a) => a.mal_id === mal_id);
        }
    );

    filteredData.forEach((element) => {
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
        slidesPerView: 2,
        spaceBetween: 15,
        freeMode: true,
        loop: false,
        autoplay: false,
        breakpoints: {
            556: {
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

    mobileMenuToggle.addEventListener("click", () => {
        mobileMenuItems.classList.toggle("active");
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
    }

    highlightActiveLink();
    displayMenu();
}
console.log(global.currentPage);

window.addEventListener("DOMContentLoaded", init);
