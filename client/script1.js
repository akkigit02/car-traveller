document.addEventListener('DOMContentLoaded', () => {
    const query = {
        to: '',
        from: ''
    }

    const setSuggestionVisible = (inputType, isVisible) => {
        const suggestion = document.getElementById(`${inputType}Suggestion`)
        suggestion.style.display = isVisible ? 'block' : 'none'
    }

    const filterFunction = async (inputType) => {
        let searchInput = document.getElementById(inputType);
        const searchQuery = searchInput.value.toLowerCase();
        const cities = await getCities(searchQuery)
        const suggestion = document.getElementById(`${inputType}Suggestion`)
        suggestion.innerHTML = ''
        if (!cities.length) {
            const div = document.createElement('ul');
            div.innerText = 'No Match Found';
            suggestion.appendChild(div);
            return
        }
        for (const city of cities) {
            const div = document.createElement('ul');
            div.innerText = `${city.name}, ${city.state_name}`;
            div.addEventListener('click', (event) => {
                query[inputType] = city._id;
                input.value = `${city.name}, ${city.state_name}`;
                suggestion.innerHTML = '';
            });
            suggestion.appendChild(div);
        }
    }

    const getCities = async (search) => {
        try {
            let response = await fetch(`http://127.0.0.1:5000/api/client/cities?search=${search}`, {
                method: "GET",
            });
            let data = await response.json();
            return data.cities;
        } catch (error) {
            console.error('Error fetching cities:', error);
            return [];
        }
    };


    const from = document.getElementById('from')
    from.addEventListener('input', (event) => { filterFunction('from') })
    from.addEventListener('focus', (event) => { setSuggestionVisible('from', true) })
    from.addEventListener('blur', (event) => { setSuggestionVisible('from', false) })

    const to = document.getElementById('to')
    to.addEventListener('input', (event) => { filterFunction('to') })
    to.addEventListener('focus', (event) => { setSuggestionVisible('to', true) })
    to.addEventListener('blur', (event) => { setSuggestionVisible('to', false) })
})