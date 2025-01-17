import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import back from './images/back-arrow.svg';
const url = process.env.NODE_ENV === 'production' ? 'https://mealplanner-is1t.onrender.com/' :  'http://127.0.0.1:8000/';

function Recipe() {
  const recipeColors = {
    0: '#EFB33F', // light yellow
    1: '#7DBB9D', // light green
    2: '#89B1FF', // light blue
  };
  console.log(localStorage)
  const location = useLocation();
  const recipeData = location.state?.recipe;
  const recipeDetails = location.state?.generatedRecipe;
  const imageUrl = location.state?.image_url;
  const color = recipeColors[location.state?.colorIndex];
  const recipeKey = location.state?.recipeKey

  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.messages) {
      setMessages(location.state.messages);
    }
  }, [location.state]);

  const chatContainerRef = useRef(null);

  const handleBackClick = () => {
    navigate('/plan');
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newMessage = { text: input, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch(`${url}update_recipe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipe: {
            details: recipeDetails,
            image_url: imageUrl,
            response: "",
            messages: messages,  // Send the existing messages
          },
          update: input,
        }),
      });

      const data = await response.json();
      const updatedRecipe = data.details;

      setMessages([...messages, newMessage, { text: data.response, sender: 'bot' }]);
      if (recipeKey) {
        const currentRecipe = JSON.parse(localStorage.getItem(recipeKey));
  
        if (currentRecipe) {
          // Update the recipe with the new details
          console.log('Updated Recipe:', updatedRecipe);
          currentRecipe.details = updatedRecipe;
  
          // Save the updated recipe back to localStorage
          localStorage.setItem(recipeKey, JSON.stringify(currentRecipe));
        } else {
          console.error('No recipe found in localStorage for the given recipeKey');
        }
      } else {
        console.error('No recipeKey found');
      }
  
      localStorage.setItem('recipeData', JSON.stringify(updatedRecipe));

      navigate('/recipe', {
        state: {
          recipe: recipeData,
          generatedRecipe: updatedRecipe,
          image_url: imageUrl,
          colorIndex: location.state?.colorIndex,
          response: data.response,
          messages: [...messages, newMessage, { text: data.response, sender: 'bot' }],  // Pass the updated messages
        },
      });
    } catch (error) {
      setMessages([...messages, newMessage, { text: 'Failed to update recipe.', sender: 'bot' }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <>
      {/* Back Arrow */}
      <button
        className="absolute top-4 left-4 p-2 rounded-full shadow hover:bg-gray-300"
        onClick={handleBackClick}
      >
        <img src={back} alt="Back" className="w-6 h-6" />
      </button>
      <div className="p-8 bg-gray-100 min-h-screen grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 flex flex-col items-center">
          {recipeData ? (
            <div className="w-full max-w-4xl bg-white p-8 ml-24 rounded-3xl shadow-lg">
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
        <div className="flex flex-col items-center bg-white p-8 m-8  rounded-3xl shadow-lg fixed top-0 right-0 h-[700px] w-1/4">
          <h2 className="text-2xl font-semibold mb-4" style={{ color: color }}>Chat</h2>
          <div ref={chatContainerRef} className="flex flex-col w-full h-full border rounded-lg p-4 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 max-w-[80%] rounded-lg ${
                message.sender === 'user'
                  ? 'text-black ml-auto' // User message (right side)
                  : 'text-black mr-auto' // Bot message (left side)
              }`}
              style={{ backgroundColor: color }}
            >
              <p className="text-m">{message.text}</p>
            </div>
            ))}
            {loading && (
              <div className={`mb-4 p-3 max-w-[80%] rounded-lg text-black mr-auto`} style={{ backgroundColor: color }}>
  <p className="text-m">Bot is typing...</p>
  <div className="loader"></div>
</div>
            )}
          </div>
          <input
            type="text"
            className="w-full p-2 border rounded-lg mt-2"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            className="mt-4 ml-64 p-2 bg-blue-500 text-white rounded-lg"
            onClick={handleSendMessage}
            style={{ backgroundColor: color }}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default Recipe;