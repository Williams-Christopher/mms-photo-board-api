const express = require('express');
const UsersService = require('./users-service');
const Helpers = require('../helpers/helpers');

//Twilio things
const twilio = require('twilio');
const { TWILIO_SID, TWILIO_AUTH, TWILIO_NUMBER } = require('../config')
const twilioClient = new twilio(TWILIO_SID, TWILIO_AUTH);


// Express things
const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const { user_first_name, user_last_name, user_name, user_password, user_phone } = req.body;
        
        const requiredFields = ['user_first_name', 'user_name', 'user_password', 'user_phone'];
        for(const field of requiredFields) {
            if(!req.body[field]) {
                return res.status(400).json({error: `Missing ${field} in request`});
            }
        };

        const validatePasswordMessage = UsersService.validatePasswordRequirements(user_password);
        if(validatePasswordMessage) {
            return res.status(400).json({error: `${validatePasswordMessage}`})
        }

        const newUser = UsersService.serializeNewUser({
            user_first_name, user_last_name, user_name, user_password, user_phone
        });

        UsersService.selectUserExists(req.app.get('db'), user_name)
            .then(userExists => {
                if(userExists) {
                    return res.status(400).json({error: `User name is in use`});
                }
                return UsersService.selectPhoneNumberExists(req.app.get('db'), user_phone)
                    .then(result => {
                        if(result) {
                            throw new Error();
                        }
                        return UsersService.insertUser(req.app.get('db'), newUser)
                            .then(newUserId => {
                                if(!newUserId) {
                                    return res.status(400).json({error: `New user was not created`});
                                }
                                twilioClient.messages.create({
                                    body: UsersService.createWelcomeSMS(newUser),
                                    from: TWILIO_NUMBER,
                                    to: user_phone
                                })
                                .then(message => {
                                    //console.log(message);
                                    return res.status(204).end();
                                })
                                .catch(error => {
                                    console.log(error);
                                    return UsersService.deleteUnverifiedUser(req.app.get('db'), newUser.user_phone)
                                        .then(rows => {
                                            return res.status(400).json({error: `Verification message could not be sent`});
                                        });
                                });
                            });
                    })
                    .catch(error => {
                        return res.status(400).json({error: 'Phone number is in use'});
                    })
            })
            .catch(error => {
                console.log(error);
                next();
            });
    });

module.exports = usersRouter;
