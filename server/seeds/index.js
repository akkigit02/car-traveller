    require('dotenv').config();
    require('../configs/database.config');


const collections = [
    'user'
];

(async () => {
    
    console.log("Seed start...")
    for(let collection of collections) {
        let  data = require(`./${collection}.seed.json`);
        let Model = require(`../models/${collection}.model`)
        console.log(collection)
        await Model.deleteMany({});
        await Model.insertMany(data)
    }

    console.log("Seeds end...")
    process.exit();
})()