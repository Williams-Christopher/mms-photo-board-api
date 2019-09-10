const xss = require('xss');
const Helpers = require('../helpers/helpers');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
    insertUser(db, newUser) {
        return db('users')
            .insert(newUser)
            .returning('id');
    },

    selectUserExists(db, user_name) {
        return db('users')
            .first()
            .where({ user_name })
            .then(user => {
                if(!user) {
                    return false;
                }
                return true;
            });
    },

    // selectPhoneNumberExists3(db, user_phone) {
    //     // TODO: Whoops... can't simply bcrypt a phone number and look
    //     // for a match. Need to compareSync(). Read in every number and
    //     // compare?
    //     // Man this will be slow...
    //     return db('users')
    //         .select('user_phone')
    //         // .then(phones => {
    //         //     return phones;
    //         // });
    // },

    // selectPhoneNumberExists2(db, user_phone) {
    //     return db('users')
    //         .select('user_phone')
    //         .then(phoneHashes => {
    //             phoneHashes.map(phoneHash => {
    //                 console.log(phoneHash.user_phone);
    //                 if(Helpers.bcryptCompare(user_phone, phoneHash.user_phone)) {
    //                     throw new Error();
    //                 }
    //             });
    //         })
    //         .catch(error => error);
    // },
    
    selectPhoneNumberExists(db, user_phone) {
        return db('users')
            .select('user_phone')
            .then(phoneHashes => {
                for(let i = 0; i < phoneHashes.length; i++) {
                    if(Helpers.bcryptCompare(user_phone, phoneHashes[i].user_phone)) {
                        // matching phone found
                        return true;
                    }
                }
                // matching phone not found
                return false;
            })
            .catch(error => error);
    },

    updateUserVerification(db, userPhoneHash) {
        return db('users')
            .where({
                'user_phone' : userPhoneHash
            })
            .update('verified', true)
            .returning('*');
    },

    deleteUnverifiedUser(db, userPhoneHash) {
        return db('users')
            .where({
                user_phone : userPhoneHash,
                verified : false
            })
            .del(); // returns # of affected rows
    },

    validatePasswordRequirements(password) {
        if(password.length < 8) {
            return 'Password is too short';
        }

        if(password.length > 40) {
            return 'Password is too long';
        }

        if(!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
            return 'Password does not meet complexity requirements'
        }
    },

    serializeNewUser(newUser) {
        return {
            user_first_name : xss(newUser.user_first_name),
            user_last_name : xss(newUser.user_last_name),
            user_name : xss(newUser.user_name),
            user_password : Helpers.bcryptString(newUser.user_password),
            user_phone : Helpers.bcryptString(newUser.user_phone),
            verified : false,
            // created : new Date(),
            // modified : new Date()
        };
    },

    createWelcomeSMS(user) {
        return `Hi, ${user.user_first_name}! This message is from MMS Photo Board. To verify your phone, reply YES before using the service. Reply NO to cancel your account creation.`
    }
};

module.exports = UsersService;
