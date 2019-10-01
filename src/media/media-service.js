const MediaService = {
    selectAllMedia(db) {
        return db
            .from('media')
            .select([
                'media.id',
                'media.user_id',
                'media.media_url',
                'media.media_caption',
                'media.media_location',
                'media.created'
            ])
            .count('media_likes.media_id', {as: 'likes'})
            .leftJoin('media_likes', 'media.id', 'media_likes.media_id')
            .groupBy([
                'media.id',
                'media.user_id',
                'media.media_url',
                'media.media_caption',
                'media.media_location',
                'media.created'
            ])
            .orderBy('media.created', 'desc')
    },

    userLikesMedia(db, userId, mediaId) {
        return db
            .from('media_likes')
            .select('id')
            .where({
                user_id: userId,
                media_id: mediaId
            })
            .then(resultId => {
                if(resultId.length === 0) {
                    return false;
                } else {
                    return true;
                }
            });
    },

    insertUserLikeForMedia(db, userId, mediaId) {
        return db
            .from('media_likes')
            .insert({
                user_id: userId,
                media_id: mediaId
            })
            .returning('id')
            .then(newId => {
                if(!newId) {
                    throw new Error('No ID returned from insert');
                }

                return db
                    .from('media_likes')
                    .count('media_id', {as: 'likes'})
                    .where({media_id: mediaId})
                    .returning('likes');
            })
            .catch(error => error);
    },

    deleteUserLikeForMedia(db, userId, mediaId) {
        return db
            .from('media_likes')
            .where({
                user_id: userId,
                media_id: mediaId
            })
            .del()
            .then(rowsAffected => {
                if(rowsAffected !== 1) {
                    throw new Error('There was an error deleting from the table');
                }

                return db
                    .from('media_likes')
                    .count('media_id', {as: 'likes'})
                    .where({media_id: mediaId})
                    .returning('likes');
            })
            .catch(error => error);
    },
};

module.exports = MediaService;
