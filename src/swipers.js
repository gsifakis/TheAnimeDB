import { swiperURLS } from "./constants.js";
import { fetchData, delay, filterData } from "./utils.js";

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

export { displayAllSwipers, displaySwiperDetailsRecommended };
