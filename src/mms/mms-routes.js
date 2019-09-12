const express = require('express');
const MMSService = require('./mms-service');
const Helpers = require('../helpers/helpers');
const cannedReplies = require('./mms-reply-messages');

//Twilio things
const twilio = require('twilio');
const { TWILIO_SID, TWILIO_AUTH, TWILIO_NUMBER } = require('../config')
const twilioClient = new twilio(TWILIO_SID, TWILIO_AUTH);
const messageResponse = require('twilio').twiml.MessagingResponse;

// Express things
const mmsRouter = express.Router();
const jsonBodyParser = express.json();
const urlBodyParser = express.urlencoded({ extended: false });

mmsRouter.post('/', urlBodyParser, (req, res, next) => {
    // tired of typing req.app.get('db');
    const db = req.app.get('db');

    // create twiml message bits
    const twiml = new messageResponse();
    let twimlReply = '';

    // grab keys from req.body
    const { NumMedia, FromCity, Body, From } = req.body;
    console.log('These values from req.body: '.NumMedia, FromCity, Body, From);

    // VERIFICATION REPLY

    if (NumMedia == 0 && Body.toLowerCase().includes('yes')) {
        MMSService.selectUserRecordForPhone(db, From)
            .then(result => {
                if (!result) {
                    throw new Error('Result from selectUserRecordForPhone was null');
                    // throw ('Result from selectUserRecordForPhone was null');
                }
                // console.log('RESULT FROM SELECT NIGHTMARE: ', result)
                return result;
            })
            .then(userRecord => {
                if (userRecord[0].verified === true) {
                    throw new Error('Already verified');
                }
                MMSService.updateUserVerification(db, userRecord[0].id)
                    .then(result => {
                        if (!result[0] === true) {
                            throw new Error('update failed');
                        }

                        return true;
                    })
                    .catch(error => false)
                return true;
            })
            .then(updateSuccess => {
                console.log('SUCCESS: ', updateSuccess);
                if (!updateSuccess) {
                    throw ('User not updated')
                }

                twimlReply = cannedReplies.verify_success;
                processSMSReply(res, twiml, twimlReply);

                return true
            })
            .catch(error => {
                // console.log('ERROR FROM SELECT-VERIFY: ', error)
                if (error.message === 'Already verified') {
                    twimlReply = cannedReplies.verify_already_complete;
                } else {
                    twimlReply = cannedReplies.verify_failure_bad_number;
                }
                processSMSReply(res, twiml, twimlReply);
            })
    } else if (NumMedia == 0 && Body.toLowerCase().includes('no')) {
        MMSService.selectUserRecordForPhone(db, From)
            .then(result => {
                if (!result) {
                    throw new Error('Result from selectUserRecordForPhone was null');
                    // throw ('Result from selectUserRecordForPhone was null');
                }
                // console.log('RESULT FROM SELECT NIGHTMARE: ', result)
                return result;
            })
            .then(userRecord => {
                if (userRecord[0].verified === true) {
                    throw new Error('Already verified');
                }
                MMSService.deleteUnverifiedUser(db, userRecord[0].user_phone)
                    .then(rowsAffected => {
                        if (rowsAffected !== 1) {
                            throw new Error('delete failed');
                        }

                        return true;
                    })
                    .catch(error => false)
                return true;
            })
            .then(deletionSuccess => {
                console.log('SUCCESS: ', deletionSuccess);
                if (!deletionSuccess) {
                    throw ('User not deleted')
                }

                twimlReply = cannedReplies.verify_decline;
                processSMSReply(res, twiml, twimlReply);

                return true
            })
            .catch(error => {
                // console.log('ERROR FROM SELECT-VERIFY: ', error)
                if (error.message === 'Already verified') {
                    twimlReply = cannedReplies.verify_already_complete;
                } else {
                    twimlReply = cannedReplies.verify_failure_bad_number;
                }
                processSMSReply(res, twiml, twimlReply);
            })

    }
    // MEDIA SUBMISSION
    else if (NumMedia >= 1) {
        console.log('Media submission');
        console.log('Submission: ', NumMedia, FromCity, Body, From);
        twimlReply = `Received media submisssion with ${NumMedia} URLs`;
    }
    // NONE OF THESE CONDITIONS / CATCHALL
    else {
        console.log('None of these somehow: ', req.body);
        twimlReply = cannedReplies.general_failure;
        processSMSReply(res, twiml, twimlReply);
    }
});

function processSMSReply(res, twiml, message) {
    console.log('processSMSReply: ', message)
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.message(message).toString());
}

module.exports = mmsRouter;
