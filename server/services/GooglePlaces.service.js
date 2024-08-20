const { Client } = require("@googlemaps/google-maps-services-js");
const { GOOGLE_PLACE_API_KEY } = process.env
const axios = require('axios')

const getAutoSearchPlaces = async (input, city = '', type = '') => {
    try {
        const client = new Client({});
        let cityArray = []
        if(!city) {
            cityArray = ['Mumbai','Thane']
        } else {
            cityArray = [city]
        }

        const combinedInput = cityArray.map(c => `${c} ${input}`).join('|');
        const data = {
            input: combinedInput,
            key: GOOGLE_PLACE_API_KEY,
            components:'country:in'
        }
        if (type)
            data['type'] = type
        const res = await client.placeAutocomplete({
            params: data,
        })
        return res.data.predictions
    } catch (error) {
        console.error(error)
        return []
    }
}

const getDistanceBetweenPlaces = async (placeId1, placeId2) => {
    try {
        // const client = new Client({});
        // const res = await client.distancematrix({
        //     params: {
        //         origins: [{ place_id: placeId1 }],
        //         destinations: [{ place_id: placeId2 }],
        //         key: GOOGLE_PLACE_API_KEY,
        //         units: 'metric', // or 'imperial'
        //     },
        //     timeout: 3000
        // });
        const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=place_id:${placeId1}&destinations=place_id:${placeId2}&key=${GOOGLE_PLACE_API_KEY}`;
        const res = await axios(url);
        if (res.data.rows[0].elements[0].status === 'OK') {
            const distance = res.data.rows[0].elements[0].distance.text;
            const duration = res.data.rows[0].elements[0].duration.text;
            console.log(`Distance: ${distance}, Duration: ${duration}`);
            return {
                distance,
                duration,
                from: res.data.origin_addresses[0],
                to: res.data.destination_addresses[0]
            };
        } else {
            console.log('No route found');
            return null;
        }
    } catch (error) {
        console.error(error);
        return null;
    }
};
module.exports = {
    getAutoSearchPlaces,
    getDistanceBetweenPlaces
};
