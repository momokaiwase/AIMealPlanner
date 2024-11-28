import React, { useState } from 'react';
import arrow from './images/arrow.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import './Plan.css';
import back from './images/back-arrow.svg'
import front from './images/front-arrow.svg'

const url = process.env.NODE_ENV === 'production' ? 'https://mealplanner-is1t.onrender.com/' :  'http://127.0.0.1:8000/';

const recipeColors = {
  0: 'bg-yellow-100', // light yellow
  1: 'bg-green-100', // light green
  2: 'bg-blue-100', // light blue
};

const extractRecipeData = (plan) => {
  const recipesData = {};
  Object.keys(plan.plan).forEach(day => {
    const breakfast = plan.plan[day].breakfast;
    const lunch = plan.plan[day].lunch;
    const dinner = plan.plan[day].dinner;
    recipesData[day] = [breakfast, lunch, dinner];
  });
  return recipesData;
};

const extractNutritionData = (plan) => {
  const nutritionData = {};
  Object.keys(plan.plan).forEach(day => {
    const nutrition = plan.plan[day].nutrition;
    if (nutrition) {
      const {calories, sodium, fat, protein} = nutrition;
      nutritionData[day] = {
        calories: calories,
        sodium: `${sodium}mg`,
        fat: `${fat}g`,
        protein: `${protein}g`
      };
    } else {
      nutritionData[day] = { 
        calories: 0, 
        sodium: 0, 
        fat: 0, 
        protein: 0 
      };
    }
  });
  return nutritionData;
};

function getCurrentWeekDates() {
  const today = new Date();
  const sunday = new Date(today.setDate(today.getDate() - today.getDay()));
  const dates = Array.from({ length: 7 }, (_, i) => {
    const nextDate = new Date(sunday);
    nextDate.setDate(sunday.getDate() + i);
    return nextDate;
  });
  return dates;
}

function formatDate(date) {
  const options = { month: 'long', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}



function Plan() {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  // Retrieve `planData` from location.state or localStorage
  const planData = location.state?.planData || JSON.parse(localStorage.getItem('planData'));  const nutritionData = extractNutritionData(planData);
  const recipesData = extractRecipeData(planData);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const weekDates = getCurrentWeekDates();
  const startDate = weekDates[0];
  const endDate = weekDates[weekDates.length - 1];
  const title = `Meal Plan for ${formatDate(startDate)} - ${formatDate(endDate)}`;
  const navigate = useNavigate();

  const handleBackClick = () => {
  const confirmBack = window.confirm(
    "If you go back, the meal plan will be discarded and you will have to regenerate it. Do you want to proceed?"
  );
  if (confirmBack) {
    navigate('/');
  }
};
  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );  

  // Handle local storage download
  const handleDownload = () => {
    const localStorageData = JSON.stringify(localStorage);
    const blob = new Blob([localStorageData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mealplan.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRecipeClick = (recipe, recipeIndex) => {
    const recipeKey = `${recipe.meal}-${recipeIndex}`;
  
    const storedRecipe = localStorage.getItem(recipeKey);
    if (storedRecipe) {
      const parsedRecipe = JSON.parse(storedRecipe);
      navigate('/recipe', { 
        state: { 
          recipe, 
          generatedRecipe: parsedRecipe.details, 
          image_url: parsedRecipe.image_url, 
          colorIndex: recipeIndex 
        }
      });
    } else {
      setLoading(true);
      fetch(`${url}get_recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          meal: recipe.meal,
          description: recipe.description,
        })
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem(recipeKey, JSON.stringify(data));
          navigate('/recipe', { 
            state: { 
              recipe, 
              generatedRecipe: data.details, 
              image_url: data.image_url, 
              colorIndex: recipeIndex 
            }
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      {loading ? (
        <div className="loading-screen flex items-center justify-center h-full">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <button
            className="absolute top-4 right-4 p-2 bg-blue-500 text-white rounded-full shadow hover:bg-blue-700"
            onClick={handleDownload}
          >
            Download Plan
          </button>
          {/* Back Arrow */}
          <button
            className="absolute top-4 left-4 p-2 rounded-full shadow hover:bg-gray-300"
            onClick={handleBackClick}
          >
            <img src={back} alt="Back" className="w-6 h-6" />
          </button>
          <h2 className="text-4xl font-semibold mt-8 mb-16 text-center text-gray-800">{title}</h2>
          <div className="w-full max-w-8xl bg-white p-8 rounded-3xl shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-7 gap-6">
              {planData && Object.keys(recipesData).map((day, index) => (
                <div
                key={day}
                className="relative border-2 border-gray-300 rounded-3xl p-4 shadow-md pb-6 overflow-hidden flex flex-col bg-white hover:shadow-2xl transition-shadow duration-300 h-[450px]"
              >
                <h3 className="text-xl font-medium text-center text-gray-700">{day}</h3>
                <p className="text-center text-gray-500 mb-6">{formatDate(weekDates[index])}</p>
              
                <div className="space-y-4 flex-grow hide-scrollbar">
                  {recipesData[day].map((recipe, recipeIndex) => (
                    <button
                      key={recipeIndex}
                      className={`${recipeColors[recipeIndex]} text-black text-sm font-medium border border-gray-400 p-2 rounded-3xl w-full h-20 flex items-center justify-center hover:border-2 hover:border-black hover:bg-opacity-75 transition-opacity duration-300`}
                      onClick={() => handleRecipeClick(recipe, recipeIndex)}
                    >
                      {recipe.meal}
                      
                    </button>
                  ))}
                </div>
              
                <div
                  className={`absolute bottom-0 left-0 right-0 bg-gray-200 text-gray-600 cursor-pointer p-2 rounded-lg transition-all duration-300 ${
                    hoveredInfo === day ? 'h-auto' : 'h-16'
                  }`}
                  onMouseEnter={() => setHoveredInfo(day)}
                  onMouseLeave={() => setHoveredInfo(null)} 
                  style={{ transition: 'height 0.3s ease-in-out'}}
                >
                  {hoveredInfo === day ? (
                    <div className="absolute bottom-0 left-0 right-0 bg-gray-200 text-gray-600 p-4 rounded-lg shadow-lg">
                      <h4 className="text-md font-bold my-2">Nutritional Content</h4>
                      <p>Calories: {nutritionData[day].calories}</p>
                      <p>Sodium: {nutritionData[day].sodium}</p>
                      <p>Fat: {nutritionData[day].fat}</p>
                      <p>Protein: {nutritionData[day].protein}</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-0">
                      <img src={arrow} alt="Arrow" className="w-6 h-6" />
                      <p>More Info</p>
                    </div>
                  )}
                </div>

                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Plan;