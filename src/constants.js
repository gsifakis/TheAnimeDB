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

export { global, swiperURLS, localRecPath, API_URL };
