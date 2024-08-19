document.addEventListener('DOMContentLoaded', () => {
    const query = {

    };
    let isValidateGlobal = true;
    const tabConfig = {
        oneWay: [
            { label: 'From', name: 'from', placeholder: 'Enter pickup city' },
            { label: 'To', name: 'to', placeholder: 'Enter pickup city' },
            { label: 'Pickup Date', name: 'pickupDate', type: 'date' },
            { label: 'Pickup Time', name: 'pickupTime', type: 'time' }
        ],
        hourly: [
            { label: 'City', name: 'from', placeholder: 'Enter pickup city' },
            { label: 'Pickup Date', name: 'pickupDate', type: 'date' },
            { label: 'Pickup Time', name: 'pickupTime', type: 'time' }
        ],
        roundTrip: [
            { label: 'From', name: 'from', placeholder: 'Enter pickup city' },
            { label: 'To', name: 'to', placeholder: 'Enter city', isMultiple: true },
            { label: 'Pickup Date', name: 'pickupDate', type: 'date' },
            { label: 'Return Date', name: 'returnDate', type: 'date' },
            { label: 'Pickup Time', name: 'pickupTime', type: 'time' }
        ],
        cityCab: [
            { label: 'Pickup Address', name: 'pickupCityCab', placeholder: 'Enter pickup address' },
            { label: 'Drop Address', name: 'dropCityCab', placeholder: 'Enter drop address' },
            { label: 'Pickup Date', name: 'pickupDate', type: 'date' },
            { label: 'Pickup Time', name: 'pickupTime', type: 'time' }
        ]
    };

    const inputType = Object.keys(tabConfig);
    inputType.forEach(type => {
        document.getElementById(type).addEventListener('click', () => selectInputType(type));
    });

    const selectInputType = (type) => {
        inputType.forEach(ele => {
            document.getElementById(`${ele}`).classList.toggle('active', ele === type);
        });
        query['tripType'] = type
        renderForm(type);
    };

    const renderForm = (type) => {
        const formContainer = document.getElementById('formContainer');
        formContainer.innerHTML = '';
        const parentContainer = document.createElement('div');
        parentContainer.classList.add('pickup-wrapper', 'wow', 'fadeInUp')
        if (type === 'roundTrip') {
            parentContainer.classList.add('pickup-wrapper2');
        }
        const formFields = tabConfig[type];
        formFields.forEach(field => {
            const wrapper = document.createElement('div');
            wrapper.classList.add('pickup-items');
            
            if (field.type === 'date') {
                wrapper.innerHTML = `
                    <label class="field-label">${field.label}</label>
                    <input type="date" id="${field.name}" change="${handleDateChange}"/>
                    <p class="error" id="error${field.name}">Please fill this field.</p>
                    `;
            } else if (field.type === 'time') {
                wrapper.innerHTML = `
                    <label class="field-label">${field.label}</label>
                    <div>
                        <select id="timeSelect" class="category-oneadjust border-0">
                            <option value="Select Time">Select Time</option>
                        </select>
                        <p class="error" id="errortimeSelect">Please fill this field.</p>
                    </div>`;
            } else {
                wrapper.classList.add('position-relative')
                if (!field?.isMultiple) {
                    wrapper.innerHTML = `
                    <label class="field-label">${field.label}</label>
                    <input name="${field.name}" id="${field.name}" placeholder="${field.placeholder}" autocomplete="off">
                    <p class="error" id="error${field.name}">Please fill this field.</p>
                    <div id="${field.name}Suggestion" class="suggestion-list"></div>
                    `;
                } else {
                    wrapper.innerHTML = `
                    <div id="toContainer" class="d-flex">
                    <div>
                    <label class="field-label">${field.label}</label>
                    <input name="${field.name}" id="${field.name}" placeholder="${field.placeholder}" autocomplete="off">
                    <p class="error" id="error${field.name}">Please fill this field.</p>
                    <div id="${field.name}Suggestion" class="suggestion-list"></div>
                    </div>
                    </div>
                    <button id="toContainerAdd" class="addBtn">+</button>
                    `;
                }
            }
            parentContainer.appendChild(wrapper);
            
        });
        const buttonWrapper = document.createElement('div');
        buttonWrapper.classList.add('pickup-items');
        buttonWrapper.innerHTML = `
        <label class="field-label style-2">button</label>
        <button class="pickup-btn" type="button" id="submitButtom">Find a Car</button>`;
        parentContainer.appendChild(buttonWrapper);
        formContainer.appendChild(parentContainer);
        getTimeForDropdown(); // Call the function to populate time dropdown
        bindSuggestionEvents(type); // Bind events to the new input element
    };

    const bindSuggestionEvents = (type) => {
        const from = document.getElementById('from');
        if (from) {
            from.addEventListener('input', () => filterFunction('from'));
            from.addEventListener('focus', () => setSuggestionVisible('from', true));
            from.addEventListener('blur', () => {
                setTimeout(() => {
                    setSuggestionVisible('from', false);
                    handleValidationOnBlur('from')
                }, 250);
            });
        }
        if (type === 'roundTrip') {
            const toContainerButton = document.getElementById('toContainerAdd')
            toContainerButton.addEventListener('click', (event) => {
                const toContainer = document.getElementById('toContainer')
                let conatinerId = toContainer.children.length + 1
                const toChildContainer = document.createElement('div');
                toChildContainer.setAttribute('id', `${conatinerId}ToContainer`)
                toChildContainer.setAttribute('class', `ms-3 d-flex align-items-end`)
                toChildContainer.innerHTML = `
                        <div>
                        <label class="field-label">To</label>
                        <input name="to" id="${conatinerId}To" placeholder="Type City" autocomplete="off">
                        <p class="error" id="error${conatinerId}To">Please fill this field.</p>
                        </div>
                        <div id="${conatinerId}ToDelete" class="delete-btn">-</div>
                        <div id="${conatinerId}ToSuggestion" class="suggestion-list"></div>
                    `
                query[`${conatinerId}To`] = ''
                toContainer.appendChild(toChildContainer)
                document.getElementById(`${conatinerId}ToDelete`).addEventListener('click', (event) => {
                    delete query[`${conatinerId}To`]
                    toChildContainer.remove()

                })
                const suggestion = document.getElementById(`${conatinerId}To`)
                suggestion.addEventListener('input', () => filterFunction(`${conatinerId}To`));
                suggestion.addEventListener('focus', () => setSuggestionVisible(`${conatinerId}To`, true));
                suggestion.addEventListener('blur', () => {
                    setTimeout(() => {
                        setSuggestionVisible(`${conatinerId}To`, false);
                        handleValidationOnBlur(`${conatinerId}To`)
                    }, 250);
                });

            })
            const to = document.getElementById('to');
            if (to) {
                to.addEventListener('input', () => filterFunction('to'));
                to.addEventListener('focus', () => setSuggestionVisible('to', true));
                to.addEventListener('blur', () => {
                    setTimeout(() => {
                        setSuggestionVisible('to', false);
                        handleValidationOnBlur('to')
                    }, 250);
                });
            }

        } else if (type === 'cityCab') {
            const pickupCityCab = document.getElementById('pickupCityCab') 
            const dropCityCab = document.getElementById('dropCityCab') 
            if(pickupCityCab) {
                pickupCityCab.addEventListener('input',() => filterFunction('pickupCityCab'))
                pickupCityCab.addEventListener('focus', () => setSuggestionVisible('pickupCityCab', true));
                pickupCityCab.addEventListener('blur', () => {
                    setTimeout(() => {
                        setSuggestionVisible('pickupCityCab', false);
                        handleValidationOnBlur('pickupCityCab')
                    }, 250);
                });
            }
            if(dropCityCab) {
                dropCityCab.addEventListener('input',() => filterFunction('dropCityCab'))
                dropCityCab.addEventListener('focus', () => setSuggestionVisible('dropCityCab', true));
                dropCityCab.addEventListener('blur', () => {
                    setTimeout(() => {
                        setSuggestionVisible('dropCityCab', false);
                        handleValidationOnBlur('dropCityCab')
                    }, 250);
                });
            }

        }else {
            const to = document.getElementById('to');
            if (to) {
                to.addEventListener('input', () => filterFunction('to'));
                to.addEventListener('focus', () => setSuggestionVisible('to', true));
                to.addEventListener('blur', () => {
                    setTimeout(() => {
                        setSuggestionVisible('to', false);
                        handleValidationOnBlur('to')
                    }, 250);
                });
            }
        }
        const submitButtom = document.getElementById('submitButtom')
        submitButtom.addEventListener('click', () => {
            const formData = {
                ...query
            }
            let isValidePickupDate = true
            let isValidePickupTime = true
            let isValideDropDate = true
            let isPickupValid = true
            let isDropValid = true
            let isValideMultiTo = true
            const timeSelect = document.getElementById('timeSelect');
            if (timeSelect){ 
                formData['pickUpTime'] = timeSelect.value
                if(!timeSelect.value) {
                    isValidePickupDate = false
                    document.getElementById(`errortimeSelect`).style.display = 'block';
                } else {
                    isValidePickupDate = true
                    document.getElementById(`errortimeSelect`).style.display = 'none';
                }
            }

            const pickupDate = document.getElementById('pickupDate');
            if (pickupDate) {
                formData['pickUpDate'] = pickupDate.value
                if(!pickupDate.value) {
                    isValidePickupDate = false
                    document.getElementById(`errorpickupDate`).style.display = 'block';
                } else {
                    isValidePickupDate = true
                    document.getElementById(`errorpickupDate`).style.display = 'none';
                }
            }
            if(query?.tripType === 'roundTrip') {
                const returnDate = document.getElementById('returnDate')
                formData['returnDate'] = returnDate.value
                if(!returnDate.value) {
                    isValideDropDate = false
                    document.getElementById(`errorreturnDate`).style.display = 'block';
                } else {
                    isValideDropDate = true
                    document.getElementById(`errorreturnDate`).style.display = 'none';
                }
                for (let key in query) {
                    if(key.match(/^\d+To$/)) {
                        const isValideError = validateField(key, `error${key}`);
                        console.log(key, `error${key}`,"====----",isValideError)
                        if(!isValideError) isValideMultiTo = false
                    }
                }
            } 
            if(query?.tripType === 'cityCab') {

                isPickupValid = validateField('pickupCityCab', 'errorpickupCityCab');
                isDropValid = validateField('dropCityCab', 'errordropCityCab');
            
                if (!isPickupValid || !isDropValid) return;
            } else if(query?.tripType === 'hourly') {
                console.log(query)
                isPickupValid = validateField('from', 'errorfrom');
            }else {
                isPickupValid = validateField('from', 'errorfrom');
                isDropValid = validateField('to', 'errorto');
            }
            
            if (!isPickupValid || !isDropValid || !isValidePickupDate || !isValideDropDate || !isValidePickupTime || !isValideMultiTo) return;
            const jsonString = JSON.stringify(formData);
            const encodedString = btoa(jsonString);
            window.location.href = `http://127.0.0.1:3000/car-list/${encodedString}`
        })

    };

    const validateField = (field, errorElementId) => {
        if (!query?.[field]?.trim()) {
            document.getElementById(errorElementId).style.display = 'block';
            return false;
        }
        document.getElementById(errorElementId).style.display = 'none';
        return true;
    };

    const setSuggestionVisible = (inputType, isVisible) => {
        const suggestion = document.getElementById(`${inputType}Suggestion`);
        suggestion.style.display = isVisible ? 'block' : 'none';
        if (isVisible) filterFunction(inputType);
        else suggestion.innerHTML = '';
    };


    const handleValidationOnBlur = (inputType) => {
        let searchInput = document.getElementById(inputType);
        if(!searchInput.value.trim()) {
            isValidateGlobal = false
            query[inputType] = ''
            document.getElementById(`error${inputType}`).style.display = 'block';
        } else {
            isValidateGlobal = true
            document.getElementById(`error${inputType}`).style.display = 'none';
        }
    }

    const filterFunction = async (inputType) => {
        let searchInput = document.getElementById(inputType);
        const searchQuery = searchInput.value.toLowerCase();
        let cities = await getCities(searchQuery);
        const queryKey = Object.keys(query)
        if (queryKey.length)
            queryKey.map(ele => {
                if (ele !== inputType) {
                    const cityId = query[ele]
                    cities = cities.filter(ele => ele._id !== cityId);
                }

            })
        const suggestion = document.getElementById(`${inputType}Suggestion`);
        suggestion.innerHTML = '';
        if (!cities.length) {
            const div = document.createElement('ul');
            div.innerText = 'No Match Found';
            suggestion.appendChild(div);
            return;
        }
        if(query?.tripType === 'cityCab') {
            for (const city of cities) {
                const div = document.createElement('div');
                div.classList.add('cstm-dropdown-list');
                div.innerText = `${city.address}`;
                div.addEventListener('click', () => {
                    query[inputType] = city.placeId
                    searchInput.value = `${city.address}`;
                    suggestion.innerHTML = '';
                });
                suggestion.appendChild(div);
            }
        } else {
            for (const city of cities) {
                const div = document.createElement('div');
                div.classList.add('cstm-dropdown-list');
                div.innerText = `${city.name}, ${city.state_name}`;
                div.addEventListener('click', () => {
                    query[inputType] = city._id
                    searchInput.value = `${city.name}, ${city.state_name}`;
                    suggestion.innerHTML = '';
                });
                suggestion.appendChild(div);
            }
        }
    };

    const getCities = async (search) => {
        try {
            let response
            let suggestions = []
            if(query?.tripType === 'cityCab') {
                response = await fetch(`http://127.0.0.1:5000/api/client/places-suggestion?search=${search}`, {
                    method: "GET",
                });

                let data = await response.json();
                console.log(data)
                suggestions = data.address
            } else {
                response = await fetch(`http://127.0.0.1:5000/api/client/cities?search=${search}`, {
                    method: "GET",
                });
                let data = await response.json();
                suggestions = data.cities
            }
            return suggestions;
        } catch (error) {
            console.error('Error fetching cities:', error);
            return [];
        }
    };

    const handleDateChange = (e) => {
        let date = new Date(e.target.value)
        date.setHours(0,0,0,0)
        let endDate = new Date(e.target.value)
        endDate.setHours(23,45,0,0)

        const optionsInterval = 15;
        const timeSelect = document.getElementById('timeSelect');
        if (!timeSelect) return;
        timeSelect.innerHTML = '';
        timeSelect.value = ''
        if(date.getDate() == new Date().getDate() && date.getMonth() == new Date().getMonth() && date.getFullYear() == new Date().getFullYear()) {
            date = new Date()
            endDate = new Date()
            endDate.setHours(23,45,0,0)
            date.setHours(date.getHours() + 1);
            date.setMinutes(date.getMinutes() + 30);
        }

        if(query?.tripType === 'roundTrip') {
            const returnDate = document.getElementById('returnDate');
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            returnDate.value = `${year}-${month}-${day}`;
            returnDate.textContent = `${day}/${month}/${year}`
            returnDate.setAttribute('min',returnDate.value)
        }
        while (date <= endDate) {
            let minutes = Math.ceil(date.getMinutes() / optionsInterval) * optionsInterval;
            if (minutes === 60) {
                minutes = 0;
                date.setHours(date.getHours() + 1);
            }
            const hours = date.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 === 0 ? 12 : hours % 12;
            const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const displayTime = `${displayHours}:${displayMinutes} ${ampm}`;
            const option = document.createElement('option');
            option.value = displayTime;
            option.textContent = displayTime;
            timeSelect.appendChild(option);
            date.setMinutes(date.getMinutes() + optionsInterval);
        }
    }

    const getTimeForDropdown = () => {
        const timeSelect = document.getElementById('timeSelect');
        if (!timeSelect) return;
        const date = new Date();
        let endDate = new Date();
        endDate.setHours(23, 45, 0, 0);
        const optionsInterval = 15;
        date.setHours(date.getHours() + 1);
        date.setMinutes(date.getMinutes() + 30);
        const now = new Date();
        now.setHours(now.getHours() + 1);
        now.setMinutes(now.getMinutes() + 30);
        if(date > endDate) {
            now.setHours(0, 30, 0, 0)
        }
        if(date > endDate) {
            date.setHours(0, 30, 0, 0)
            endDate.setDate(endDate.getDate() + 1);
            endDate.setHours(23, 45, 0, 0)
        }

        const inputElement = document.getElementById('pickupDate');
        inputElement.addEventListener('change',handleDateChange)
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        inputElement.value = `${year}-${month}-${day}`;
        inputElement.textContent = `${day}/${month}/${year}`
        inputElement.setAttribute('min',inputElement.value)
        if(query?.tripType === 'roundTrip') {
            const returnDate = document.getElementById('returnDate');

        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        returnDate.value = `${year}-${month}-${day}`;
        returnDate.textContent = `${day}/${month}/${year}`
        returnDate.setAttribute('min',returnDate.value)
        }

        let nowMinutes = Math.ceil(now.getMinutes() / optionsInterval) * optionsInterval;
        if (nowMinutes === 60) {
            nowMinutes = 0;
            now.setHours(date.getHours() + 1);
        }

        while (date <= endDate) {
            let minutes = Math.ceil(date.getMinutes() / optionsInterval) * optionsInterval;
            if (minutes === 60) {
                minutes = 0;
                date.setHours(date.getHours() + 1);
            }
            const hours = date.getHours();
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const displayHours = hours % 12 === 0 ? 12 : hours % 12;
            const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const displayTime = `${displayHours}:${displayMinutes} ${ampm}`;
            const option = document.createElement('option');
            option.value = displayTime;
            option.textContent = displayTime;
            if (date.getHours() === now.getHours() && date.getMinutes() === now.getMinutes()) {
                option.selected = true;
            }
            timeSelect.appendChild(option);
            date.setMinutes(date.getMinutes() + optionsInterval);
        }
    };

    // Initially render the form for the first active tab
    selectInputType('cityCab');
});

