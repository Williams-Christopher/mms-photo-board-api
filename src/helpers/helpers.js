const bcrypt = require('bcryptjs');
// const { BCRYPT_SALT } = require('../config');

const Helpers = {
    
    bcryptString(s) {
        // TODO: Why did this start failing when I fixed the import?
        // ohhhh it's a string in the .env file, not a number.
        // return bcrypt.hashSync(s, BCRYPT_SALT);
        return bcrypt.hashSync(s, 12);
    },

    bcryptCompare(string, hash) {
        return bcrypt.compareSync(string, hash);
    },
};

module.exports = Helpers;
