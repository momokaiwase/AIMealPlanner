import React, { useState } from 'react';
import arrow from './images/arrow.svg';
import { useLocation } from 'react-router-dom';

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

const nutritionData = {
  Sunday: { calories: 2000, sodium: '1500mg', fat: '30g', protein: '100g' },
  Monday: { calories: 1800, sodium: '1400mg', fat: '25g', protein: '90g' },
  Tuesday: { calories: 1900, sodium: '1300mg', fat: '27g', protein: '85g' },
  Wednesday: { calories: 2100, sodium: '1600mg', fat: '32g', protein: '95g' },
  Thursday: { calories: 2000, sodium: '1500mg', fat: '28g', protein: '100g' },
  Friday: { calories: 2200, sodium: '1700mg', fat: '35g', protein: '110g' },
  Saturday: { calories: 2300, sodium: '1800mg', fat: '38g', protein: '120g' },
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
  const location = useLocation();
  const planData = location.state?.planData;
  console.log('Plan Data:', planData);
  const [hoveredInfo, setHoveredInfo] = useState(null);
  const weekDates = getCurrentWeekDates();
  const startDate = weekDates[0];
  const endDate = weekDates[weekDates.length - 1];
  const title = `Meal Plan for ${formatDate(startDate)} - ${formatDate(endDate)}`;

  return (
    <div className="p-4">
      <h2 className="text-4xl font-semibold mt-10 mb-20 text-center">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
        {planData && Object.keys(planData).map((day, index) => (
          <div
            key={day}
            className="relative border-2 border-gray-300 rounded-3xl p-4 shadow-md h-[480px] overflow-hidden"
          >
            <h3 className="text-xl font-medium mb-2 text-center">{day}</h3>
            <p className="text-center text-gray-600 mb-6">{formatDate(weekDates[index])}</p>

            <div
              className={`space-y-4 transition-all duration-300 ${
                hoveredInfo === day ? 'hidden' : 'block'
              }`}
            >
              {recipesData[day].map((recipe, recipeIndex) => (
                <button
                  key={recipeIndex}
                  className={`${recipeColors[recipe]} text-black text-sm font-medium border border-gray-400 py-8 px-8 rounded-3xl w-full`}
                >
                  {recipe}
                </button>
              ))}
            </div>

            <div
              className={`absolute bottom-0 left-0 right-0 bg-gray-200 text-gray-600 cursor-pointer p-2 transition-all duration-300 ${
                hoveredInfo === day ? 'h-[380px]' : 'h-16'
              }`}
              onMouseEnter={() => setHoveredInfo(day)}
              onMouseLeave={() => setHoveredInfo(null)}
            >
              {hoveredInfo === day ? (
                <div className="text-center text-black">
                  <h4 className="text-md font-bold my-2">Nutritional Content</h4>
                  <p>Calories: {nutritionData[day].calories}</p>
                  <p>Sodium: {nutritionData[day].sodium}</p>
                  <p>Fat: {nutritionData[day].fat}</p>
                  <p>Protein: {nutritionData[day].protein}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-0">
                  <img src={arrow} alt="Arrow" className="" />
                  <p>More Info</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Plan;
