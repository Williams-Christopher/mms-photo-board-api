const express = require('express');
const AuthService = require('./auth-service');

const authRouter = express.Router();
const jsonBodyParser = express.json();

authRouter
    .post('/', jsonBodyParser, (req, res, next) => {
        const db = req.app.get('db');

        const { user_name, password } = req.body;
        const loginUser = { user_name, password };

        for(const [ key, value ] of Object.entries(loginUser)) {
            if(!value) {
                return res.status(400).json({ error: `Missing ${key} in request body`});
            }
        }

        AuthService.getUserWithUserName(db, loginUser.user_name)
            .then(userRecord => {
                if(!userRecord) {
                    return res.status(400).json({ error: `Invalid user name or password`});
                }

                if(!AuthService.comparePasswords(loginUser.password, userRecord.user_password)) {
                    return res.status(400).json({ error: `Invalid user name or password`});
                }

                const tokenSubject = userRecord.user_name;
                const tokenPayload = { id: userRecord.id };

                return res.send({ authToken: AuthService.createJwt(tokenSubject, tokenPayload) });
            })
            .catch(next);
    });

module.exports = authRouter;
