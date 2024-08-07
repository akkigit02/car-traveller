require('dotenv').config();
require('../configs/database.config');
const cities = require('../constants/cities');
const CityModel = require('../models/city.model');

(async () => {
    const cityArray = cities.filter(ele => ele.country_id === 101).map(city => ({
        name: city.name,
        state_name: city.state_name,
        country_name: city.country_name,
        latitude: city.latitude,
        longitude: city.longitude,
        isActive: true
    }));
    const bulkSize = 1000;
    for (let i = 0; i < cityArray.length; i += bulkSize) {
        const bulk = cityArray.slice(i, i + bulkSize);
        try {
            await CityModel.insertMany(bulk);
            console.log(`Inserted ${bulk.length} cities`);
        } catch (err) {
            console.error('Error inserting bulk:', err);
        }
    }
})()
