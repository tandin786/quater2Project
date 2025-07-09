const mealsnameClass =
  "text-black text-2xl font-bold uppercase text-center bg-white p-4 rounded-b-lg shadow-md w-70";
const mealsidClass =
  "text-black text-xl font-bold uppercase text-center bg-white p-2 rounded-b-lg shadow-md w-70 mt-2";
const mealsimageClass =
  "bg-white rounded-t-lg p-4 h-70 w-70 bg-cover bg-center mx-auto";
const mealsimageClass2 =
  "bg-white rounded-t-lg p-4 h-100 w-100 bg-cover bg-center mx-auto mt-20";
const ingredientClass =
  "text-black text-2xl font-bold uppercase text-center bg-white p-4 shadow-md w-70";
const ingredientImageClass = "";

const recipeClass = "text-black bg-white/80 p-4 w-auto mr-20";

const display = document.getElementById("display");
const container = document.getElementById("container");
const container2 = document.getElementById("container2");
const recipeContainer = document.getElementById("recipe-container");
const ingredientContainer = document.getElementById("popular-ingredients");
const categoriesTitle = document.getElementById("categories-title");
const createNewButton = document.getElementById("create-new");

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
  const container = document.getElementById("container");
  container.setAttribute("class", "grid grid-cols-4 gap-8 mt-9");
  container.innerHTML = "";
  if (!disvalue) {
    console.error("Search input is empty");
    restoreCategories();
    return;
  }
  axios
    .get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${disvalue}`)
    .then(function (response) {
      console.log(response, "search response");
      container.innerHTML = "";
      if (container2) {
        container2.innerHTML = "";
      }
      if (categoriesTitle) {
        categoriesTitle.style.display = "none";
      }
      if (createNewButton) {
        createNewButton.style.display = "none";
      }
      if (response.data.meals) {
        response.data.meals.forEach((meal) => {
          addFoods(meal.strMeal, meal.strMealThumb, meal.idMeal);
        });
      } else {
        console.log("No meals found");
        container.innerHTML = "<p>No meals found</p>";
        restoreCategories();
      }
    })
    .catch(function (error) {
      console.error("Error fetching search data:", error);
      restoreCategories();
    });
}

function getById(event) {
  const mealId = event.currentTarget.dataset.mealId;
  console.log(mealId, "meal visitor id");

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
axios.get(`http://localhost:5008/item`).then(function (response) {
  console.log(response, "ing");
  response.data.forEach((ing) => {
    addIng(ing.Items, ing.Image);
  });
});
function addIng(ingName, ingPosterUrl) {
  const ing = document.createElement("div");
  ing.className =
    "flex flex-col items-center bg-white shadow-lg w-70 rounded-full my-15";
  ingredientContainer.appendChild(ing);

  const popularImage = document.createElement("img");
  popularImage.setAttribute("src", ingPosterUrl);
  popularImage.setAttribute("class", ingredientImageClass);
  ing.appendChild(popularImage);

  const popularName = document.createElement("p");
  popularName.innerText = ingName;
  popularName.setAttribute("class", mealsnameClass);
  ing.appendChild(popularName);
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

    const image = document.createElement("img");
    image.setAttribute("src", meal.strMealThumb);
    image.setAttribute("class", mealsimageClass2);
    recipeContainer.appendChild(image);

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

function createCategory(event) {
  event.preventDefault();

  const categoryName = document.getElementById("categoryName").value.trim();
  const categoryImage = document.getElementById("categoryimg").value.trim();

  if (!categoryName || !categoryImage) {
    console.error("Category name or image URL is empty");
    alert("Please fill in both the item name and image URL.");
    return;
  }

  const categoryData = {
    Item: categoryName,
    Image: categoryImage,
  };

  axios
    .post(`http://localhost:5008/items`, categoryData)
    .then(function (response) {
      console.log(response, "create category response");
      document.getElementById("create-category-form").reset();
      window.location.reload();
    })
    .catch(function (error) {
      console.error("Error creating category:", error);
      alert("Failed to add category. Please try again.");
    });
}

function openModal() {
  const modal = document.getElementById("category-modal");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

function closeModal() {
  const modal = document.getElementById("category-modal");
  if (modal) {
    modal.classList.add("hidden");
    document.getElementById("create-category-form").reset();
  }
}

function restoreCategories() {
  if (container2) {
    container2.innerHTML = "";
    axios
      .get(`http://localhost:5008/items`)
      .then(function (response) {
        console.log(response, "categories response");
        response.data.forEach((cat) => {
          addCat(cat.Item, cat.Image);
        });
        if (categoriesTitle) {
          categoriesTitle.style.display = "block";
        }
        if (createNewButton) {
          createNewButton.style.display = "block";
        }
      })
      .catch(function (error) {
        console.error("Error fetching categories:", error);
      });
  }
}

display.addEventListener("input", function () {
  if (!display.value.trim()) {
    container.innerHTML = "";
    restoreCategories();
  }
});
