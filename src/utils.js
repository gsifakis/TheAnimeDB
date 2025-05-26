import { global } from "./constants.js";

async function fetchData(path) {
    try {
        const response = await fetch(path);
        if (response.ok) {
            const resData = await response.json();
            return resData;
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

function showAlert(message) {
    const alertEl = document.createElement("div");
    alertEl.classList.add("alert");
    alertEl.appendChild(document.createTextNode(message));
    document.querySelector("#alert").appendChild(alertEl);

    setTimeout(() => alertEl.remove(), 2000);
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

function displayMobileMenu() {
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

function capitalizeFirstLetter(string) {
    return string[0].toUpperCase() + string.slice(1);
}

function hideLoader() {
    const hero = document.querySelector(".hero");
    const heroLoading = document.querySelector(".hero-loading");
    hero.classList.add("visible");
    heroLoading.classList.add("hidden");
}

export {
    fetchData,
    delay,
    filterData,
    showAlert,
    highlightActiveLink,
    displayMobileMenu,
    capitalizeFirstLetter,
    hideLoader,
};
