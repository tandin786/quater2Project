const mealsnameClass =
  "text-gray-900 text-2xl font-semibold uppercase text-center bg-white p-4 rounded-b-lg shadow-lg w-full";
const mealsidClass =
  "text-gray-700 text-lg font-medium text-center bg-white p-2 rounded-b-lg shadow-lg w-full mt-2";
const mealsimageClass =
  "bg-white rounded-t-lg p-4 h-64 w-full object-cover bg-center mx-auto";
const mealsimageClass2 =
  "rounded-xl h-96 w-full max-w-lg bg-cover bg-center mx-auto object-cover shadow-xl";
const ingredientClass =
  "text-gray-900 text-lg font-semibold uppercase text-center bg-white p-3 shadow-lg w-full";
const ingredientImageClass =
  "rounded-full h-48 w-48 bg-cover bg-center mx-auto object-cover shadow-md";
const recipeClass =
  "text-white bg-gray-800/95 p-8 rounded-xl shadow-xl w-full max-w-3xl mx-auto leading-relaxed backdrop-blur-sm";
const display = document.getElementById("display");
const container = document.getElementById("container");
const container2 = document.getElementById("container2");
const recipeContainer = document.getElementById("recipe-container");
const ingredientContainer = document.getElementById("popular-ingredients");
const categoriesTitle = document.getElementById("categories-title");
const createNewButton = document.getElementById("create-new");
const ingredientsTitle = document.getElementById("ingredients-title");
const SignForm = document.getElementById("SignIn-Modal");
const logForm = document.getElementById("logIn-Modal")
const SingingButton = document.getElementById("logSinButton");

function addRecipe(descriptionOfMeal) {
  const recipe = document.createElement("div");
  recipe.setAttribute("class", recipeClass);
  const recipeInstruction = document.createElement("p");
  recipeInstruction.innerText = descriptionOfMeal;
  recipeInstruction.className =
    "text-gray-200 text-base leading-relaxed tracking-wide";
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
    "flex flex-col items-center bg-white rounded-xl shadow-lg w-full cursor-pointer";
  container.appendChild(result);

  const image = document.createElement("img");
  image.setAttribute("src", foodimageURL);
  image.setAttribute("class", mealsimageClass);
  image.setAttribute("alt", foodsname);
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
  const errorContainers = document.getElementById("errorContainer");
  errorContainers.setAttribute("class", "text-red-400");
  errorContainers.innerHTML = "";
  container.setAttribute(
    "class",
    "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-12"
  );
  container.innerHTML = "";
  if (!disvalue) {
    errorContainers.innerText = "search field is empty";
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
      if (ingredientContainer) {
        ingredientContainer.style.display = "none";
      }
      if (ingredientsTitle) {
        ingredientsTitle.style.display = "none";
      }
      if (response.data.meals) {
        response.data.meals.forEach((meal) => {
          addFoods(meal.strMeal, meal.strMealThumb, meal.idMeal);
        });
      } else {
        console.log("No meals found");
        errorContainers.innerText = "No meals found";
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
        window.location.href = `./recipe.html?mealId=${mealId}`;
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
    "flex flex-col items-center bg-white rounded-2xl shadow-lg w-64 h-64 my-8 overflow-hidden";
  ingredientContainer.appendChild(ing);

  const popularImage = document.createElement("img");
  popularImage.setAttribute("src", ingPosterUrl);
  popularImage.setAttribute("class", ingredientImageClass);
  popularImage.setAttribute("alt", ingName);
  ing.appendChild(popularImage);

  const popularName = document.createElement("p");
  popularName.innerText = ingName;
  popularName.setAttribute("class", ingredientClass);
  ing.appendChild(popularName);
}

function addCat(catName, catPosterUrl) {
  const cat = document.createElement("div");
  cat.className =
    "flex flex-col items-center bg-white rounded-xl shadow-lg w-64";
  container2.appendChild(cat);

  const image = document.createElement("img");
  image.setAttribute("src", catPosterUrl);
  image.setAttribute("class", mealsimageClass);
  image.setAttribute("alt", catName);
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

    const title = document.createElement("h3");
    title.innerText = meal.strMeal;
    title.className =
      "text-white text-3xl font-bold text-center mb-8 tracking-tight";
    recipeContainer.appendChild(title);

    const image = document.createElement("img");
    image.setAttribute("src", meal.strMealThumb);
    image.setAttribute("class", mealsimageClass2);
    image.setAttribute("alt", meal.strMeal);
    recipeContainer.appendChild(image);

    addRecipe(meal.strInstructions);
  } else if (recipeContainer) {
    recipeContainer.innerHTML =
      "<p class='text-white text-center text-lg'>No meal data available</p>";
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
        if (ingredientContainer) {
          ingredientContainer.style.display = "grid";
        }
        if (ingredientsTitle) {
          ingredientsTitle.style.display = "block";
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




function openLoginForm() {
  
  if (logForm) {
    logForm.classList.remove("hidden");
  }
}


function closeLoginForm() {
  if (logForm) {
    logForm.classList.add("hidden");
    document.getElementById("UserLogin").reset();
  }
}

function openSignInForm() {
  
  if (SignForm) {
    SignForm.classList.remove("hidden");
  }
}


function closeSignInForm() {
  if (SignForm) {
    SignForm.classList.add("hidden");
    document.getElementById("UserRegistration").reset();
  }
}







function RegisterUser(event) {
  // event.preventDefault();
  const usersUsername = document.getElementById("SignUsername");
  const usernameValue = usersUsername.value;
  const UserPassword = document.getElementById("SignUserPassword");
  const passwordValue = UserPassword.value;
  const loginError = document.createElement("p");
  const registrationButton = document.getElementById("registrationButtons");
  loginError.setAttribute("class", "text-red-400");
  if (!usernameValue || !passwordValue) {
    console.error("Both field should be filled");
    alert("Please fill in both the item name and image URL.");
    return;
  }

  const UserData = {
    username: usernameValue,
    password: passwordValue,
  };

  axios
    .post(`http://localhost:5110/register`, UserData)
    .then(function (response) {
      console.log(response.data.message);
      document.getElementById("UserRegistration").reset();
      registrationButton.innerHTML = "";
      alert("User created. Thank You.")
      closeSignInForm();
      openLoginForm();
    })
    .catch(function (error) {
      if(error.response){
        const status = error.response.status
        if(status === 409){
          alert("User Already Exist")
        }else{
          alert("Make sure you field both the filled")
        }
      }else{
        alert("make sure all field are filled")
      }
    });
}



function loginFunction(event){
  event.preventDefault();
  const usersUsername = document.getElementById("Username");
  const usernameValue = usersUsername.value;
  const UserPassword = document.getElementById("UserPassword");
  const passwordValue = UserPassword.value;
  if (!usernameValue || !passwordValue) {
    console.error("Both field should be filled");
    alert("Please fill in both");
    return;
  }

  const UserData = {
    username: usernameValue,
    password: passwordValue,
  };

  axios
    .post(`http://localhost:5110/login`, UserData)
    .then(function (response) {
      console.log(response.data.message);
      
      document.getElementById("UserLogin").reset();
      alert("Signed in successfully");
      SingingButton.innerHTML = "";
      SingingButton.setAttribute("class", "hidden");
      closeLoginForm();
      alert("Signed in successfully");
        document.getElementById("reviewSection").classList.remove("hidden");


    })
    .catch(function (error) {
      if(error.response){
        const status = error.response.status
        if(status === 409){
          alert("User Already Exist")
        }else{
          alert("Login Failed")
        }
      }else{
        alert("make sure all field are filled")
      }
    });
}

if(SingingButton.innerHTML === ""){
  document.getElementById("reviewSection").classList.remove("hidden");
}

