const { json } = require('express');

function bodyParser() {
    return function (req, res, next) {
        const JSONParser = json({ limit: '100mb' });
        return JSONParser(req, res, next);
    };
};

module.exports = {
    bodyParser,
}