require('dotenv').config();
require('../configs/database.config');
const fs = require('fs')
const cities = require('../constants/provideCity.constants');
const CityModel = require('../models/cities.model');

(async () => {
    console.log(`Script start...`);
    for (const city of cities) {
        try {
            await CityModel.updateOne({ name: city?.city_name }, {$set: { isActive: true, isMetroCity: city.isMetrocity }});
        } catch (err) {
            console.error('Error inserting bulk:', err);
        }
    }
    console.log('script end...')
    process.exit()
})()
