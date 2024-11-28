import React from 'react';
import { useNavigate , useLocation } from 'react-router-dom';
import back from './images/back-arrow.svg'


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
  const navigate = useNavigate();


  const handleBackClick = () => {
    navigate('/plan');
  };

  return (
    <>
      {/* Back Arrow */}
      <button
        className="absolute top-4 left-4 p-2 rounded-full shadow hover:bg-gray-300"
        onClick={handleBackClick}
      >
        <img src={back} alt="Back" className="w-6 h-6" />
      </button>
      <div className="p-8 bg-gray-100 min-h-screen flex flex-col items-center">
        {recipeData ? (
          <div className="w-full max-w-4xl bg-white p-8 rounded-3xl shadow-lg">
            <h1 className="text-4xl font-semibold mb-4 text-center" style={{ color: color }}>
              Recipe: {recipeData.meal}
            </h1>
            <h2 className="text-2xl font-normal italic text-center mb-8">{recipeData.description}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="col-span-2">
                {recipeDetails ? (
                  <div className="mb-14">
                    <h3 className="text-2xl font-medium mb-4">Ingredients:</h3>
                    <ul className="list-disc list-inside mx-4">
                      {recipeDetails.ingredients.map((ingredient, index) => (
                        <li key={index} className="text-lg">{ingredient}</li>
                      ))}
                    </ul>
                    <h3 className="text-2xl font-medium mt-10 mb-4">Steps:</h3>
                    <ol className="list-decimal list-inside mx-4 space-y-2">
                      {recipeDetails.steps.map((step, index) => (
                        <li key={index} className="text-lg">{step}</li>
                      ))}
                    </ol>
                  </div>
                ) : (
                  <p className="text-lg">No recipe details found.</p>
                )}
              </div>

              {imageUrl && (
                <div className="col-span-1 flex justify-center items-start mt-4">
                  <img src={imageUrl} alt={`Image of ${recipeData.meal}`} className="w-full h-auto rounded-lg shadow-md" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-lg">No recipe data found.</p>
        )}
      </div>
  </>
  );
}

export default Recipe;