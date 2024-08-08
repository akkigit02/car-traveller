document.addEventListener('DOMContentLoaded', () => {
    const query = {
        to: '',
        from: ''
    }
    const submitSuttom = document.getElementById(`submitSuttom`)
    submitSuttom.addEventListener('click', () => {

        //  error handle 
        console.log(query)
        const jsonString = JSON.stringify(query);
        const encodedString = btoa(jsonString);
        console.log(encodedString);
    })









    const setSuggestionVisible = (inputType, isVisible) => {
        const suggestion = document.getElementById(`${inputType}Suggestion`)
        suggestion.style.display = isVisible ? 'block' : 'none'
        if (isVisible)
            filterFunction(inputType)
        else {
            const suggestion = document.getElementById(`${inputType}Suggestion`)
            suggestion.innerHTML = ''
        }
    }

    const filterFunction = async (inputType) => {
        let searchInput = document.getElementById(inputType);
        const searchQuery = searchInput.value.toLowerCase();
        let cities = await getCities(searchQuery)
        if (inputType === 'from' && query.to) {
            cities = cities.filter(ele => ele._id !== query.to)
        } else if (inputType === 'to' && query.from) {
            cities = cities.filter(ele => ele._id !== query.from)
        }
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
            suggestion.appendChild(div);
            div.addEventListener('click', (event) => {
                query[inputType] = city._id;
                searchInput.value = `${city.name}, ${city.state_name}`;
                suggestion.innerHTML = '';
            });
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
    // from.addEventListener('blur', (event) => { setSuggestionVisible('from', false) })

    const to = document.getElementById('to')
    to.addEventListener('input', (event) => { filterFunction('to') })
    to.addEventListener('focus', (event) => { setSuggestionVisible('to', true) })
    // to.addEventListener('blur', (event) => { setSuggestionVisible('to', false) })
})