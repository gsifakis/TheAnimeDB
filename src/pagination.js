import { fetchData } from "./utils.js";
import { global, API_URL } from "./constants.js";
import { displaySearchRes } from "./search.js";

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

export { displayPageBtns, displayPagination };
