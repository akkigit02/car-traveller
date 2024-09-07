const mongoose = require('mongoose');
const dbName = process.env.DB_NAME;
const dbUrl = `${process.env.DB_URL}/${dbName}` || `mongodb://localhost:27017/${dbName}`;

mongoose
  .connect(dbUrl, {
    dbName,
    autoIndex: true,
    // poolSize: 20,
  })
  .then((status) => console.info(`Connection establised to ${dbName}`))
  .catch((err) =>
    console.error(`Could not connect to database: ${err.message}`)
  );
