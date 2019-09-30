const AuthService = require('../auth/auth-service');

function requireAuth(req, res, next) {
    const db = req.app.get('db');
    const authToken = req.get('Authorization') || '';

    let bearerToken;
    if(!authToken.toLowerCase().startsWith('bearer ')) {
        return res.status(401).json({ error: 'Missing bearer token' });
    } else {
        bearerToken = authToken.slice(7, authToken.length);
    }

    try {
        const payload = AuthService.verifyJwt(bearerToken); // get contents of token
        AuthService.getUserWithUserName(db, payload.sub)
            .then(userRecord => {
                if(!userRecord) {
                    return res.status(401).json({ error: 'Unauthorized request' });
                }
                // placing the complete user record as an object in the request for use in the next middleware
                req.userRecord = userRecord;
                next();
            })
            .catch(err => {
                console.error(err);
                next(err);
            });
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized request' });
    };
};

module.exports = requireAuth;
