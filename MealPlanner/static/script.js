function selectCuisine(cuisine) {
    const dropdownButton = document.getElementById('cuisineDropdown');
    dropdownButton.textContent = cuisine;
}

document.getElementById('submitBtn').addEventListener('click', async () => {
    const calories = document.getElementById('caloriesInput').value;
    const cuisine = document.getElementById('cuisineDropdown').textContent;
    
    // Collect other button selections
    const suggestions = [];
    document.querySelectorAll('.button-row button').forEach(button => {
        if (button.classList.contains('active')) {
            suggestions.push(button.textContent);
        }
    });

    const data = {
        calories,
        cuisine,
        suggestions
    };

    try {
        const response = await fetch('http://localhost:8000/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            window.location.href = 'next-page.html';
        } else {
            console.error('Error submitting data:', response.statusText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
});
