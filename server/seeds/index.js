require('dotenv').config();
require('../configs/database.config');


const collections = [
    'user',
    'cities'
];

(async () => {

    console.log("Seed start...")
    for (let collection of collections) {
        let data = require(`./${collection}.seed.json`);
        let Model = require(`../models/${collection}.model`)
        await Model.deleteMany({});
        console.log(collection)
        const bulkSize = 1000;
        for (let i = 0; i < data.length; i += bulkSize) {
            const bulk = data.slice(i, i + bulkSize);
            await Model.insertMany(bulk);
        }
    }
    console.log("Seeds end...")
    process.exit();
})()