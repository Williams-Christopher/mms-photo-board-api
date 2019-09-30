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
                    throw new Error('Phone number could not be compareed to any existing hash');
                }
                
                return db
                    .from('users')
                    .select('*')
                    .where('user_phone', matchingHash)
                    .then(record => {
                        if (!record) {
                            throw new Error('A record with the hash was not found');
                        }
                        // A user record for with the hashed phone number was found
                        // so return the user record [{id: 2, user_name: 'name' ... etc }]
                        return record;
                    })
                    .catch(error => { throw new Error(error) });
            })
            .catch(error => {
                // Either a hash was not found that compares to the incoming phone number
                // or a user record containing the hashed number was (somehow) not found
                // return null
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
    },

    deleteUnverifiedUser(db, userPhoneHash) {
        return db('users')
            .where({
                user_phone: userPhoneHash,
                verified: false
            })
            .del(); // returns # of affected rows
    },

    insertMedia(db, mediaRecord = {}) {
        return db('media').insert({...mediaRecord}).returning('id');
    },

    serializeMediaRecord(newMediaData = {}) {
        return {
            user_id: newMediaData.id,
            media_url: newMediaData.url,
            media_caption: xss(newMediaData.caption),
            media_location: newMediaData.city,
        };
    }
}

module.exports = MMSService;
