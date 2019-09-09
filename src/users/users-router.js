const express = require('express');
const xss = require('xss');

//Twilio things
const twilio = require('twilio');
const { TWILIO_SID, TWILIO_AUTH, TWILIO_MYNUMBER, TWILIO_NUMBER } = require('../config')
const twilioClient = new twilio(TWILIO_SID, TWILIO_AUTH);
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

// Express things
const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .post('/', (req, res, next) => {
        res.send('OK');
    });

module.exports = usersRouter;
