require('dotenv').config();
require('../configs/database.config');
const fs = require('fs')
const cities = require('../constants/cities');
const CityModel = require('../models/cities.model');

(async () => {
    const bulkSize = 1000;
    for (let i = 0; i < cities.length; i += bulkSize) {
        const bulk = cities.slice(i, i + bulkSize);
        try {
            await CityModel.insertMany(bulk);
            console.log(`Inserted ${bulk.length} cities`);
        } catch (err) {
            console.error('Error inserting bulk:', err);
        }
    }
})()
