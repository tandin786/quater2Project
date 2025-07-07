const mealsnameClass =
  "text-black rounded-b-lg text-2xl font-bold uppercase text-center bg-white/100 w-70";
const mealsimageClass = "bg-white rounded-t-lg p-4 h-70 w-auto";
const display = document.getElementById("display");
const container = document.getElementById("container");

function addFoods(foodsname, foodimageURL) {
  const result = document.createElement("div");
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
