import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Select.css';
import lowcarb from './images/lowcarb.svg';
import filling from './images/filling.svg';
import healthy from './images/healthy.svg';
import lowfat from './images/lowfat.svg';

const url = process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000/' : 'https://human-ai.onrender.com/';
function Select() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectedCuisine, setSelectedCuisine] = useState('Select Cuisine');
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const selectCuisine = (cuisine) => {
    setSelectedCuisine(cuisine);
    setDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleButtonClick = (button) => {
    setSelectedButtons((prevSelected) => {
      if (prevSelected.includes(button)) {
        return prevSelected.filter((b) => b !== button);
      } else {
        return [...prevSelected, button];
      }
    });
  };

  const buttonClass = (button) => {
    return selectedButtons.includes(button)
      ? 'btn-selected'
      : 'btn-default';
  };

  const LoadingSpinner = () => (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  );

  const handleSubmit = () => {
    setLoading(true);
    fetch(`${url}get_week`, {
      method: "POST",
      body: JSON.stringify({restrictions: selectedButtons, cuisine: selectedCuisine, calories: calories }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        navigate('/plan', { state: { planData: data } });
      })
      .finally(() => {
        setLoading(false);
      });
    setSelectedButtons([]);
    setSelectedCuisine('Select Cuisine');
    setCalories('');
  };

  return (
    <div className="p-4">
    {loading ? (
          <div className="loading-screen">
            <LoadingSpinner />
          </div>
        ) : (
        <>
          <h2 className="text-4xl font-semibold my-12">Make Your Suggestions</h2>
          <div className="flex justify-center space-x-28 mb-2">
          <img src={lowcarb} alt="Low Carb" className="w-12 h-12" />
              <img src={filling} alt="Filling" className="w-12 h-12" />
              <img src={healthy} alt="Healthy" className="w-12 h-12" />
              <img src={lowfat} alt="Low Fat" className="w-12 h-12" />
            </div>
            <div className="flex justify-center space-x-16 mb-10">
              <button className={`btn1 ${buttonClass('Low Carb')}`} onClick={() => handleButtonClick('Low Carb')}>Low Carb</button>
              <button className={`btn1 ${buttonClass('Filling')}`} onClick={() => handleButtonClick('Filling')}>Filling</button>
              <button className={`btn1 ${buttonClass('Healthy')}`} onClick={() => handleButtonClick('Healthy')}>Healthy</button>
              <button className={`btn1 ${buttonClass('Low Fat')}`} onClick={() => handleButtonClick('Low Fat')}>Low Fat</button>
            </div>
            <div className="flex justify-center space-x-16 mb-10">
              <button className={`btn2 ${buttonClass('Gluten-Free')}`} onClick={() => handleButtonClick('Gluten-Free')}>Gluten-Free</button>
              <button className={`btn2 ${buttonClass('Lactose-Free')}`} onClick={() => handleButtonClick('Lactose-Free')}>Lactose-Free</button>
              <button className={`btn2 ${buttonClass('Nut-Free')}`} onClick={() => handleButtonClick('Nut-Free')}>Nut-Free</button>
              <button className={`btn2 ${buttonClass('Vegetarian')}`} onClick={() => handleButtonClick('Vegetarian')}>Vegetarian</button>
            </div>
            <div className="flex justify-center space-x-16 mb-10">
              <button className={`btn3 ${buttonClass('Vegan')}`} onClick={() => handleButtonClick('Vegan')}>Vegan</button>
              <button className={`btn3 ${buttonClass('Halal')}`} onClick={() => handleButtonClick('Halal')}>Halal</button>
              <button className={`btn3 ${buttonClass('Kosher')}`} onClick={() => handleButtonClick('Kosher')}>Kosher</button>
            </div>
            <div className="flex justify-center mb-4 relative">
              <button
                className="btn2 bg-gray-300 text-black px-4 py-2 rounded"
                type="button"
                id="cuisineDropdown"
                onClick={toggleDropdown}
              >
                {selectedCuisine}
              </button>
              {dropdownOpen && (
                <ul className="dropdown-menu absolute bg-white border border-gray-300 rounded shadow mt-14 z-10 max-h-48 overflow-y-auto">
                  {['Mexican', 'Indian', 'Chinese', 'Thai', 'x', 'x', 'x', 'x', 'x'].map((cuisine) => (
                    <li key={cuisine}>
                      <a
                        className="dropdown-item block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        href="#"
                        onClick={() => selectCuisine(cuisine)}
                      >
                        {cuisine}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-center mb-4">
              <input
                type="number"
                className="btn2 border border-gray-300 px-4 py-2 rounded"
                id="caloriesInput"
                placeholder="Enter Calories"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
            </div>
            <div className="flex justify-center">
              <button className="submit" id="submitBtn" onClick={handleSubmit}>Submit</button>
            </div>
        </>
      )}
    </div>
  );
  
}
export default Select;
