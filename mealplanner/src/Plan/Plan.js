import React from 'react';

const recipesData = {
  Sunday: ['Recipe 1', 'Recipe 2', 'Recipe 3'],
  Monday: ['Recipe 1', 'Recipe 2', 'Recipe 3'],
  Tuesday: ['Recipe 1', 'Recipe 2', 'Recipe 3'],
  Wednesday: ['Recipe 1', 'Recipe 2', 'Recipe 3'],
  Thursday: ['Recipe 1', 'Recipe 2', 'Recipe 3'],
  Friday: ['Recipe 1', 'Recipe 2', 'Recipe 3'],
  Saturday: ['Recipe 1', 'Recipe 2', 'Recipe 3'],
};

const recipeColors = {
  'Recipe 1': 'bg-[#FAF1C0]', // light yellow
  'Recipe 2': 'bg-[#C9E4DE]', // light green
  'Recipe 3': 'bg-[#C6DEF1]', // light blue
};

function Plan() {
  return (
    <div className="p-4">
      <h2 className="text-4xl font-semibold mt-10 mb-12 text-center">Meal Plan</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {Object.keys(recipesData).map((day) => (
          <div key={day} className="border-2 border-gray-300 rounded-3xl p-4 shadow-md">
            <h3 className="text-xl font-medium mb-4 text-center">{day}</h3>

            <div className="space-y-4">
              {recipesData[day].map((recipe, index) => (
                <button
                  key={index}
                  className={`${recipeColors[recipe]} text-black text-sm font-medium border border-gray-400 py-8 px-8 rounded-3xl w-full hover:opacity-90`}
                >
                  {recipe}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Plan;
