

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search');
    const suggestionsList = document.getElementById('suggestions');

    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.toLowerCase();
        if (query.length > 0) {
            const filteredSuggestions = await getCities(query)
            filteredSuggestions.forEach(suggestion => {
                const suggestionItem = document.createElement('li');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = suggestion.name;
                suggestionItem.addEventListener('click', () => {
                    searchInput.value = suggestion.name;
                    suggestionsList.innerHTML = '';
                });
                suggestionsList.appendChild(suggestionItem);
            });
        }
    });
    const getCities = async (search) => {
        let response = await fetch(`http://127.0.0.1:5000/api/client/cities?search=${search}`, {
            method: "GET",
        });
        let data = await response.json();
    }

    console.log(data);
})


