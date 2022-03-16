// const areaSearch = "Canadian";
// const categorySearch = "Vegetarian";
const meals = ["chicken", "soup", "beef", "pork"];
const userSearch = document.getElementById("userSearch");
const searchBtn = document.getElementById("searchButton");
const searchText = document.querySelector(".search-text");


const pickRandomMeal = () => {
    const randomIdx = Math.floor(Math.random() * meals.length);
    return meals[randomIdx];
}

const updateSelectionsInStorage = (selections, item) => {
    selections.push(item);
    localStorage.setItem("selections", JSON.stringify(selections));
}

const addMealToSelections = itemName => {
    const itemObj = JSON.parse(sessionStorage.getItem(itemName));
    if (localStorage.getItem("selections")) {
        updateSelectionsInStorage(JSON.parse(localStorage.getItem("selections")), itemObj);
    } else {
        updateSelectionsInStorage([], itemObj);
    }
}

const removeMealFromSelections = itemName => {
    let selections = JSON.parse(localStorage.getItem("selections"));
    selections = selections.filter(mealObj => mealObj.strMeal !== itemName);
    localStorage.setItem("selections", JSON.stringify(selections));
}

const changeIconAndUpdateSelections = event => {
    const classString = event.target.className.split(" ");
    if (classString[2] === "fa-circle-not-selected") {
        const itemName = classString.slice(4).join(" ");
        event.target.className = `fa-solid fa-circle-plus fa-2xl ${itemName}`;
        addMealToSelections(itemName);
    } else if (classString[2] === "fa-2xl") {
        const itemName = classString.slice(3).join(" ");
        event.target.className = `fa-solid fa-circle-plus fa-circle-not-selected fa-2xl ${itemName}`;
        removeMealFromSelections(itemName);
    }
}

const retrieveMealFromStorage = event => {
    return JSON.parse(sessionStorage.getItem(event.target.attributes.value.value));
}

const removeCards = () => {
    while (document.querySelector(".cardContainer")) {
        document.body.removeChild(document.querySelector(".cardContainer"))
    }
}

const renderCardContainer = (cardContainer, htmlString) => {
    cardContainer.innerHTML = htmlString;
    cardContainer.addEventListener("click", changeIconAndUpdateSelections);
    document.body.appendChild(cardContainer);
}

const fetchMeals = async mealToSearch => {
    let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealToSearch}`);
    return await response.json();
}

const renderMealCards = data => {
    let html = "";
    let cardContainer;
    for (let idx = 0; idx < data.meals.length; idx++) {
        if (idx % 3 === 0) {
            cardContainer = document.createElement("div");
            cardContainer.className = "cardContainer";
            html = "";
        }
        html += `
        <div class="card">
            <img src=${data.meals[idx].strMealThumb} class="card-img-top" alt=${data.meals[idx].strMeal}>
            <i class="fa-solid fa-circle-plus fa-circle-not-selected fa-2xl ${data.meals[idx].strMeal}"></i>
            <i class="fa-solid fa-circle fa-2xl"></i>
            <h5 class="card-title">${data.meals[idx].strMeal}</h5>
            <button class="btn btn-warning" value="${data.meals[idx].strMeal}">Description</button>
        </div>`;
        if ((idx + 1) % 3 === 0) renderCardContainer(cardContainer, html);
    }
    if (html) renderCardContainer(cardContainer, html);

    for (const meal of data.meals) {
        sessionStorage.setItem(meal.strMeal, JSON.stringify(meal))
    }
}

const searchForMeals = async event => {
    event.preventDefault();
    const userInput = userSearch.value.trim();
    if (userInput) {
        const data = await fetchMeals(userInput);
        console.log(data);
        removeCards();
        if (!data.meals) {
            searchText.innerText = `Search produced no results. Please try something different.`;
        } else {
            searchText.innerText = "Search or scroll for inspiration to add to your recipe box!";
            renderMealCards(data);
        }
    }
}


searchBtn.addEventListener("click", searchForMeals, event);


const onPageVisit = async () => {
    const mealToSearch = pickRandomMeal();
    const data = await fetchMeals(mealToSearch);
    renderMealCards(data);
}

onPageVisit();


/* 
selected
<i class="fa-solid fa-circle-plus fa-2xl"></i>
<i class="fa-solid fa-circle fa-2xl"></i>

unselected
<i class="fa-solid fa-circle-plus fa-circle-not-selected fa-2xl"></i>
<i class="fa-solid fa-circle fa-2xl"></i>
*/

// data.meals is an array of recipes
// traverse data.meals and retrieve following keys
// strIngredient1 -> strIngredient20 - loop until null or empty string
// strMeasure1 -> strMeasure20 - loop until falsey
// strMeasure1 goes with strIngredient1
// strMeal is name of meal
// strMealThumb is url of meal image
// strInstructions is cooking method description

//     for (let idx = 0; idx < 6; idx++) {
//         ingredientList = [...ingredientList, ...createIngredientStrings(data.meals[idx])[0]];
//         ingredientBullets = [...ingredientBullets, ...createIngredientStrings(data.meals[idx])[1]];
//     }
    // console.log(ingredientList);

    

// =================== USING STORAGE WITH CARDS =================================

// when rendering cards, need to add a value attribute to modal button that is equal to meal name aka meal.strMeal
// once clicked, use that value to retrive the data object from storage
// const card = document.querySelector(".card");
// card.addEventListener("click", event => {
//     const itemObj = JSON.parse(sessionStorage.getItem(event.target.attributes.value.value));
// })


// ======================= CATEGORY SEARCH ======================================

// fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categorySearch}`)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })

// data.meals is an array of meals
// each object element only has 3 keys - idMeal, strMeal, strMealThumb
// need to use meal search api in combination to retrieve recipe


// ======================= AREA SEARCH ======================================

// fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${areaSearch}`)
// .then(response => response.json())
// .then(data => {
//     console.log(data);
// })

// same response type/structure as category search

