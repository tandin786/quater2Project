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
  const errorContainer = document.getElementById("errorContainers");
  errorContainer.innerHTML = "";
  const errorMessage = document.createElement("p");
  errorMessage.className = "text-red-400";
  if (!disvalue) {
    errorMessage.innerText = "search Bar empty";
    errorContainer.appendChild(errorMessage);
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
        errorMessage.innerText = "No meals by that name";
        errorContainer.appendChild(errorMessage);
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
  const deleteBox = document.createElement("Button");
  deleteBox.setAttribute("onclick", `deleteCategory('${catName}')`);
  deleteBox.className = "flex justify-end h-8 w-8 bg-red-500 text-white rounded-full ";
  deleteBox.innerText = "X";
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
  cat.appendChild(deleteBox);
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
showCategory();
function showCategory() {
  if (container2) {
    container2.innerHTML = "";
    axios
      .get(`http://localhost:5008/items`)
      .then(function (response) {
        console.log(response, "categories response");
        response.data.forEach((cat) => {
          addCat(cat.Item, cat.Image);
        });
      })
      .catch(function (error) {
        console.error("Error fetching categories:", error);
      });
  }
}
function deleteCategory(Item) {
  axios.delete(`http://localhost:5008/items/${Item}`)
  .then((response) => {
    showCategory();
  });
}
