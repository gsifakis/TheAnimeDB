import { swiperURLS, API_URL } from "./constants.js";
import { fetchData, hideLoader } from "./utils.js";
import { displaySwiperDetailsRecommended } from "./swipers.js";

async function displayDetails(type) {
    const id = window.location.search.split("=")[1];
    const { data } = await fetchData(`${API_URL}${type}/${id}`);

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

    if (data.status !== "Not yet aired") {
        swiperURLS.similarAnime = `https://api.jikan.moe/v4/${type}/${id}/recommendations`;

        await displaySwiperDetailsRecommended(
            `${type}`,
            `https://api.jikan.moe/v4/${type}/${id}/recommendations`
        );
    } else {
        const similarTitle = document.querySelector(".similar-title");
        similarTitle.remove();
    }
    hideLoader();
}

export default displayDetails;
