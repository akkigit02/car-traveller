const mongoose = require('mongoose');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mloflo';
const dbName =  process.env.DB_NAME;

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
