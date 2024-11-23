import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Select.css';
import lowcarb from './images/lowcarb.svg';
import filling from './images/filling.svg';
import healthy from './images/healthy.svg';
import lowfat from './images/lowfat.svg';

const url = process.env.NODE_ENV === 'production' ? 'https://mealplanner-is1t.onrender.com/' :  'http://127.0.0.1:8000/';

const LoadingScreen = () => {
  const messages = [
    { text: 'Preparing your meal plan...', img: lowcarb },
    { text: 'Fetching the best recipes...', img: filling },
    { text: 'Almost ready...', img: healthy },
  ];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen flex flex-col items-center justify-center min-h-screen">
      <img src={messages[currentMessageIndex].img} alt="Loading" className="w-24 h-24 mb-4 animate-fade" />
      <p className="text-xl text-gray-700 animate-fade">{messages[currentMessageIndex].text}</p>
    </div>
  );
};

function Select() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedButtons, setSelectedButtons] = useState([]);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [calories, setCalories] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const cuisines = ['Italian', 'Chinese', 'Indian', 'Mexican', 'Japanese', 'Mediterranean', 'French', 'Thai'];
  const dietaryRestrictions = ['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free', 'Soy-Free'];

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCuisineClick = (cuisine) => {
    setSelectedCuisines((prev) => 
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const handleButtonClick = (button) => {
    setSelectedButtons((prev) => 
      prev.includes(button) ? prev.filter((b) => b !== button) : [...prev, button]
    );
  };

  const handleSubmit = () => {
    console.log(JSON.stringify({restrictions: selectedButtons, cuisines: selectedCuisines, calories: calories }))
    if (!calories || calories < 1200) {
      setError('Your body needs at least 1,200 calories a day, please input a valid caloric value');
      return;
    }

    const payload = {
      restrictions: selectedButtons,
      cuisines: selectedCuisines, // Ensure this matches the backend model
      calories: parseInt(calories, 10), // Ensure calories is an integer
    };

    setLoading(true);
    fetch(`${url}get_week`, {
      method: "POST",
      body: JSON.stringify(payload),
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
    setSelectedCuisines([]);
    setCalories('');
    setError('');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex flex-col items-center">
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <h2 className="text-4xl font-semibold mt-8 mb-16 text-center text-gray-800">Select Your Preferences</h2>
          <div className="w-full max-w-2xl bg-white p-8 rounded-3xl shadow-lg">
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Cuisines</label>
              <div className="relative">
                <button
                  className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                  onClick={toggleDropdown}
                >
                  {selectedCuisines.length > 0 ? selectedCuisines.join(', ') : 'Select Cuisines'}
                </button>
                {dropdownOpen && (
                  <ul className="absolute w-full bg-white border border-gray-300 rounded-lg mt-2 z-10">
                    {cuisines.map((cuisine) => (
                      <li
                        key={cuisine}
                        className={`px-4 py-2 hover:bg-gray-200 cursor-pointer ${selectedCuisines.includes(cuisine) ? 'bg-gray-200' : ''}`}
                        onClick={() => handleCuisineClick(cuisine)}
                      >
                        {cuisine}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Calories</label>
              <input
                type="number"
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Preferences</label>
              <div className="grid grid-cols-2 gap-4">
                {[{ img: lowcarb, label: 'Low Carb' }, { img: filling, label: 'Filling' }, { img: healthy, label: 'Healthy' }, { img: lowfat, label: 'Low Fat' }].map((item) => (
                  <button
                    key={item.label}
                    className={`flex items-center justify-center p-4 border rounded-lg ${selectedButtons.includes(item.label) ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'} hover:shadow-lg transition-shadow duration-300`}
                    onClick={() => handleButtonClick(item.label)}
                  >
                    <img src={item.img} alt={item.label} className="w-8 h-8 mr-2" />
                    <span className="text-gray-700">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">Dietary Restrictions</label>
              <div className="grid grid-cols-2 gap-4">
                {dietaryRestrictions.map((restriction) => (
                  <button
                    key={restriction}
                    className={`flex items-center justify-center p-4 border rounded-lg ${selectedButtons.includes(restriction) ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-white'} hover:shadow-lg transition-shadow duration-300`}
                    onClick={() => handleButtonClick(restriction)}
                  >
                    <span className="text-gray-700">{restriction}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Generate Plan'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Select;