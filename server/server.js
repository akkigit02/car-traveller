require('dotenv').config();
require('./configs/database.config');
const port = process.env.SERVER_PORT || 5000
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const requestIp = require('request-ip');
const userAgent = require('express-useragent');
global.logger = require('./utils/logger.util.js');
const app = express();
app.use(morgan('dev'));
const { bodyParser } = require('./utils/bodyParser.util.js');
app.use(bodyParser());
app.use(express.urlencoded({ extended: true }));
app.use(requestIp.mw());
app.use(userAgent.express());
app.use(cors());
app.use('/api/', require('./routes/index.js'));
const ClientManager=require('./managers/client.manager.js')
app.get('/invoice/:id', ClientManager.getInvoiceInfo)
app.get('*', (req, res) => {
    res.status(404).json({
        msg: 'Sorry, This route is not found on this server',
    });
});

app.use(async function (error, req, res, next) {
    logger.log('errorHandler', error, req.userId, {
        'query': req?.query,
        'params': req?.params,
        'body': req?.body,
        'route': req?._parsedUrl?.pathname,
        'method': req?.method
    });
    return res.status(500).send(error.message || '');
});


app.listen(port, () => {
    console.log(`server is listen to port ${port}`)
})
module.exports = app;
