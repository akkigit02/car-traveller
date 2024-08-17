const { Client } = require("@googlemaps/google-maps-services-js");
const { GOOGLE_PLACE_API_KEY } = process.env

const getAutoSearchPlaces = async (input, city = '', type = '') => {
    try {
        const client = new Client({});
        const data = {
            input: city ? `${city} ${input}` : input,
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

module.exports = {
    getAutoSearchPlaces
};
