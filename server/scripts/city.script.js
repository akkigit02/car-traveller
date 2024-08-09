require('dotenv').config();
require('../configs/database.config');
const fs = require('fs')
const cities = require('../constants/provideCity.constants');
const CityModel = require('../models/cities.model');

(async () => {
    for (const city of cities) {
        try {
            await CityModel.updateOne({ name: city }, { isActive: true, isMetroCity: city.isMetrocity });
            console.log(`Inserted ${bulk.length} cities`);
        } catch (err) {
            console.error('Error inserting bulk:', err);
        }
    }
})()
