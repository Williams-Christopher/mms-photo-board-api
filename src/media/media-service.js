const MediaService = {
    selectAllMedia(db) {
        // select m.id, m.user_id, m.media_url, m.media_caption, m.media_location, m.created, count(ml.media_id) as likes from media m
        // left join media_likes ml
        // on m.id = ml.media_id
        // group by m.id, m.user_id, m.media_url, m.media_caption, m.media_location, m.created
        // order by m.id
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
            .orderBy('media.id')
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
