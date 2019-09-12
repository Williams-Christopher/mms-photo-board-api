const bcrypt = require('bcryptjs');
const { BCRYPT_SALT } = require('../config');

const Helpers = {
    
    hashString(s) {
        return bcrypt.hashSync(s, BCRYPT_SALT);
    },

    hashCompare(string, hash) {
        return bcrypt.compareSync(string, hash);
    },
};

module.exports = Helpers;
