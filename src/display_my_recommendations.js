import { localRecPath } from "./constants.js";
import { fetchData, capitalizeFirstLetter, hideLoader } from "./utils.js";

async function displayRecommended(type) {
    const parentDiv = document.querySelector(".my-recommendations");

    console.log(parentDiv);
    const box = document.createElement("div");
    box.classList.add(`${type}-recommendations`);

    // create h2 for recommendation type
    const boxTitle = document.createElement("h2");
    boxTitle.innerHTML = `My ${capitalizeFirstLetter(type)} Recommendations`;

    box.appendChild(boxTitle);

    const myType = document.createElement("div");
    myType.id = `my-${type}`;
    myType.classList.add("results-grid");

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

    box.appendChild(myType);
    parentDiv.appendChild(box);
    hideLoader();
}

export default displayRecommended;
