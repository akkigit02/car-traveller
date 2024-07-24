require('dotenv').config();
require('./configs/database.config');

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const requestIp = require('request-ip');
const userAgent = require('express-useragent');
const Logger = require('./utils/logger.util.js');
const app = express();

if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}
const { bodyParser } = require('./utils/bodyParser.util.js');
const { encrypt } = require('./utils/crypto.util.js');
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());
app.use(userAgent.express());
app.use(cors());

// app.use('/api/', api);

app.get('*', (req, res) => {
    res.status(404).json({
        msg: 'Sorry, This route is not found on this server',
    });
});
    console.log(encrypt('66a139f01e693ce868201dc2'))
app.use(async function (error, req, res, next) {
    Logger.log('errorHandler', error, req.userId, {
        'query': req?.query,
        'params': req?.params,
        'body': req?.body,
        'route': req?._parsedUrl?.pathname,
        'method': req?.method
    });
    res.status(500).send(error.message || '');
});

module.exports = app;