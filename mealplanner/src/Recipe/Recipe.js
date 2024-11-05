import React from 'react';
import { useLocation } from 'react-router-dom';

function Recipe() {
  const location = useLocation();
  const recipeData = location.state?.recipe;

  console.log('Recipe Data:', recipeData);

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
    </div>
  );
}

export default Recipe;
