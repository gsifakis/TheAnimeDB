import { localRecPath } from "./constants.js";
import { fetchData } from "./utils.js";

async function displayRecommended(type) {
    const myType = document.getElementById(`my-${type}`);

    const { data } = await fetchData(
        `${localRecPath}${type}-recommendations.json`
    );

    data.forEach((el) => {
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
    });
}

export default displayRecommended;
