const xss = require('xss');
const Helpers = require('../helpers/helpers');

const MMSService = {
    selectUserRecordForPhone(db, cleartextUserPhone) {
       return db
            .from('users')
            .select('user_phone')
            .then(hashedPhones => {
                for (let i = 0; i < hashedPhones.length; i++) {
                    if (Helpers.hashCompare(cleartextUserPhone, hashedPhones[i].user_phone)) {
                        return hashedPhones[i].user_phone;
                    }
                }
            })
            .then(matchingHash => {
                if(!matchingHash) {
                    throw new Error('a matching has was not found');
                    // throw ('a matching hash was not found');
                }
                
                return db
                    .from('users')
                    .select('*')
                    .where('user_phone', matchingHash)
                    .then(record => {
                        if (!record) {
                            throw new Error('Record not found');
                            // throw ('Record not found');
                        }
                        return record;
                    })
                    .catch(error => console.log('in the select: ', error));
            })
            .catch(error => {
                // console.log('MATCHING PHONE HASH NOT FOUND error: ', error);
                return null;
            });
    },

    updateUserVerification(db, userId) {
        return db('users')
            .where({
                id: userId,
                verified: false
            })
            .update('verified', true)
            .returning('verified')
            // .then(result => {
            //     console.log(result);
            //     return result
            // })
            // .catch(error => {
            //     console.log(error);
            //     return error;
            // })
    },

    deleteUnverifiedUser(db, userPhoneHash) {
        return db('users')
            .where({
                user_phone: userPhoneHash,
                verified: false
            })
            .del(); // returns # of affected rows
    },
}

module.exports = MMSService;
