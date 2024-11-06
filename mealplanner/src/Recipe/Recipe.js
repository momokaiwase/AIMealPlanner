import React from 'react';
import { useLocation } from 'react-router-dom';

function Recipe() {
  const recipeColors = {
    0: '#EFB33F', // light yellow
    1: '#7DBB9D', // light green
    2: '#89B1FF', // light blue
  };

  const location = useLocation();
  const recipeData = location.state?.recipe;
  const recipeDetails = location.state?.generatedRecipe;
  const imageUrl = location.state?.image_url;
  const color = recipeColors[location.state?.colorIndex];

  return (
    <div>
      {recipeData ? (
        <div>
          <h1 className="text-3xl font-semibold mx-10 mt-10 mb-4" style={{color: color}}>Recipe: {recipeData.meal}</h1>
          <h1 className="text-2xl font-normal mx-10 italic">{recipeData.description}</h1>
        </div>
      ) : (
        <p>No recipe data found.</p>
      )}
      
      <div className="mx-10 mt-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          {recipeDetails ? (
            <div className="mb-14">
              <h1 className='text-2xl font-medium mb-2'>Ingredients:</h1>
              <ul className="list-disc list-inside mx-12">
                {recipeDetails.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
              <h1 className='text-2xl font-medium mt-10 mb-2'>Steps:</h1>
              <ol className="list-decimal list-inside mx-12 space-y-0">
                {recipeDetails.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          ) : (
            <p>No recipe details found.</p>
          )}
        </div>

        {imageUrl && (
          <div className="col-span-1 flex justify-center items-start mt-[10px]">
            <img src={imageUrl} alt={`Image of ${recipeData.meal}`} className="w-96 h-auto my-4" />
          </div>
        )}
      </div>
    </div>
  );
}

export default Recipe;
