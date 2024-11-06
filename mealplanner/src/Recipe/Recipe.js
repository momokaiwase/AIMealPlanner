import React from 'react';
import { useLocation } from 'react-router-dom';


function Recipe() {
  const location = useLocation();
  const recipeData = location.state?.recipe;
  const recipeDetails = location.state?.generatedRecipe.details;

  console.log('Recipe Data:', recipeData);
  console.log('Recipe Details:', recipeDetails);
  console.log('Recipe Details ingredients:', recipeDetails.ingredients);

  return (
    <div>
      <h1 className="text-3xl font-semibold">Recipe Details</h1>
      {recipeData ? (
        <div>
          <p>Meal: {recipeData.meal}</p>
          <p>Description: {recipeData.description}</p>
        </div>
      ) : (
        <p>No recipe data found.</p>
      )}
      {recipeDetails ? (
        <div>
          <h2>Ingredients:</h2>
          <ul className="list-disc list-inside ml-4">
            {recipeDetails.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <h2>Steps:</h2>
          <ol className="list-decimal list-inside ml-4">
            {recipeDetails.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
      </div>
      ) : (
        <p>No recipe details found.</p>
      )}
    </div>
  );
}


export default Recipe;