document.addEventListener('DOMContentLoaded', () => {
    const query = {
        to: '',
        from: ''
    }
    const submitSuttom = document.getElementById(`submitSuttom`)
    submitSuttom.addEventListener('click', () => {
        //  error handle 
        const jsonString = JSON.stringify(query);
        const encodedString = btoa(jsonString);
        console.log(encodedString);
        window.location.href = `http://127.0.0.1:3000/car-list/${encodedString}`
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
            const div = document.createElement('div');
            div.classList.add('cstm-dropdown-list')
            div.innerText = `${city.name}, ${city.state_name}`;
            div.addEventListener('click', (event) => {
                console.log(56)
                query[inputType] = city._id;
                searchInput.value = `${city.name}, ${city.state_name}`;
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
    from.addEventListener('blur', (event) => {
        setTimeout(() => {
            setSuggestionVisible('from', false)
        }, 250)
    })

    const to = document.getElementById('to')
    to.addEventListener('input', (event) => { filterFunction('to') })
    to.addEventListener('focus', (event) => { setSuggestionVisible('to', true) })
    to.addEventListener('blur', (event) => {
        setTimeout(() => {
            setSuggestionVisible('to', false)
        }, 250)
    })

    const getTimeForDropdown = () => {
        const timeSelect = document.getElementById('timeSelect');
        const date = new Date();
        const endDate = new Date();
        endDate.setHours(23, 45, 0, 0); // 11:45 PM
        const optionsInterval = 15; // interval in minutes

        date.setHours(date.getHours() + 1);
        date.setMinutes(date.getMinutes() + 30);

        const datepickerElement = document.getElementById('datepicker');
        const inputElement = datepickerElement.querySelector('input');

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0'); // January is 0!
        const year = date.getFullYear();

        const formattedDate = day + '-' + month + '-' + year;
        inputElement.value = formattedDate;

        // Round the current minutes up to the nearest 30-minute interval
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(now.getMinutes() + 30);
    
        while (date <= endDate) {
          let minutes = Math.ceil(date.getMinutes() / optionsInterval) * optionsInterval;
          if(minutes === 60) {
            minutes = 0
            date.setHours(date.getHours() + 1);
          }
            const hours = date.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 === 0 ? 12 : hours % 12;
            const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const displayTime = `${displayHours}:${displayMinutes} ${ampm}`;

            const isoTime = date.toISOString();

            const option = document.createElement('option');
            option.value = isoTime;
            option.textContent = displayTime;
            if (date.getHours() === now.getHours() && date.getMinutes() === now.getMinutes()) {
                option.selected = true;
            }
            timeSelect.appendChild(option);
            date.setMinutes(date.getMinutes() + optionsInterval);
        }
    }

    getTimeForDropdown()
})