const mealsnameClass =
  "text-black rounded-b-lg text-2xl font-bold uppercase text-center bg-white/100 w-70";
const mealsimageClass =
  "bg-white rounded-t-lg p-4 h-70 w-70 bg-cover bg-center";
const display = document.getElementById("display");
const container = document.getElementById("container");
const container2 = document.getElementById("container2");

function addFoods(foodsname, foodimageURL) {
  const result = document.createElement("button");
  container.appendChild(result);

  const image = document.createElement("img");
  image.setAttribute("src", foodimageURL);
  image.setAttribute("class", mealsimageClass);
  result.appendChild(image);

  const name = document.createElement("p");
  name.innerText = foodsname;
  name.setAttribute("class", mealsnameClass);
  result.appendChild(name);
}

search();

function search() {
  const disvalue = display.value;
  axios
    .get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${disvalue}`)
    .then(function (response) {
      console.log(response);
      container.innerHTML = "";
      response.data.meals.forEach((meal) => {
        addFoods(meal.strMeal, meal.strMealThumb);
      });
    });
}
function addCat(catName, catPosterUrl) {
  const cat = document.createElement("div");
  container2.appendChild(cat);

  const image = document.createElement("img");
  image.setAttribute("class", mealsimageClass);
  image.style = `background-image: url("${catPosterUrl}")`;
  cat.appendChild(image);

  const mealName = document.createElement("p");
  mealName.innerText = catName;
  mealName.setAttribute("class", mealsnameClass);

  cat.appendChild(mealName);
}

axios
  .get(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  .then(function (response) {
    console.log(response);
    response.data.categories.forEach((cat) => {
      addCat(cat.strCategory, cat.strCategoryThumb);
    });
  });
