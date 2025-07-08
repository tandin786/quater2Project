const mealsnameClass =
  "text-black text-2xl font-bold uppercase text-center bg-white p-4 rounded-b-lg shadow-md w-70";
const mealsidClass =
  "text-black text-xl font-bold uppercase text-center bg-white p-2 rounded-b-lg shadow-md w-70 mt-2";
const mealsimageClass =
  "bg-white rounded-t-lg p-4 h-70 w-70 bg-cover bg-center";
const recipeClass = "text-black bg-white/80 p-4 w-70";
const display = document.getElementById("display");
const container = document.getElementById("container");
const container2 = document.getElementById("container2");
const recipeContainer = document.getElementById("recipe-container");

function addRecipe(descriptionOfMeal) {
  const recipe = document.createElement("div");
  recipe.setAttribute("class", recipeClass);
  const recipeInstruction = document.createElement("p");
  recipeInstruction.innerText = descriptionOfMeal;
  recipe.appendChild(recipeInstruction);
  if (recipeContainer) {
    recipeContainer.appendChild(recipe);
  }
}

function addFoods(foodsname, foodimageURL, food_id) {
  const result = document.createElement("button");
  result.setAttribute("data-meal-id", food_id);
  result.addEventListener("click", getById);
  result.className =
    "flex flex-col items-center bg-white rounded-lg shadow-lg w-70";
  container.appendChild(result);

  const image = document.createElement("img");
  image.setAttribute("src", foodimageURL);
  image.setAttribute("class", mealsimageClass);
  result.appendChild(image);

  const name = document.createElement("p");
  name.innerText = foodsname;
  name.setAttribute("class", mealsnameClass);
  result.appendChild(name);

  const foodId = document.createElement("p");
  foodId.innerText = `ID: ${food_id}`;
  foodId.setAttribute("class", mealsidClass);
  result.appendChild(foodId);
}

function search() {
  const disvalue = display.value.trim();
  if (!disvalue) {
    console.error("Search input is empty");
    return;
  }
  axios
    .get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${disvalue}`)
    .then(function (response) {
      console.log(response, "search response");
      container.innerHTML = "";
      if (response.data.meals) {
        response.data.meals.forEach((meal) => {
          addFoods(meal.strMeal, meal.strMealThumb, meal.idMeal);
        });
      } else {
        console.log("No meals found");
        container.innerHTML = "<p>No meals found</p>";
      }
    })
    .catch(function (error) {
      console.error("Error fetching search data:", error);
    });
}

function getById(event) {
  const mealId = event.currentTarget.dataset.mealId;
  console.log(mealId, "meal id");

  axios
    .get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
    .then(function (response) {
      console.log(response);
      if (response.data.meals && response.data.meals[0]) {
        localStorage.setItem(
          "mealData",
          JSON.stringify(response.data.meals[0])
        );

        window.open(`./recipe.html?mealId=${mealId}`, "_blank");
      }
    })
    .catch(function (error) {
      console.error("Error fetching meal data:", error);
    });
}

function addCat(catName, catPosterUrl) {
  const cat = document.createElement("div");
  cat.className =
    "flex flex-col items-center bg-white rounded-lg shadow-lg w-70";
  container2.appendChild(cat);

  const image = document.createElement("img");
  image.setAttribute("src", catPosterUrl);
  image.setAttribute("class", mealsimageClass);
  cat.appendChild(image);

  const mealName = document.createElement("p");
  mealName.innerText = catName;
  mealName.setAttribute("class", mealsnameClass);
  cat.appendChild(mealName);
}

function displayMealDetails() {
  const meal = JSON.parse(localStorage.getItem("mealData"));
  if (recipeContainer && meal) {
    recipeContainer.innerHTML = "";
    addRecipe(meal.strInstructions);
  } else if (recipeContainer) {
    recipeContainer.innerHTML = "<p>No meal data available</p>";
  }
}

if (document.getElementById("recipe-container")) {
  displayMealDetails();
}

if (container2) {
  axios
    .get(`https://www.themealdb.com/api/json/v1/1/categories.php`)
    .then(function (response) {
      console.log(response, "categories response");
      response.data.categories.forEach((cat) => {
        addCat(cat.strCategory, cat.strCategoryThumb);
      });
    })
    .catch(function (error) {
      console.error("Error fetching categories:", error);
    });
}
