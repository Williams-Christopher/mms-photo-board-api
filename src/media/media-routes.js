const express = require('express');
const MediaService = require('./media-service');

const jsonBodyParser = express.json();
const mediaRouter = express.Router();

mediaRouter
    .all('/', (req, res, next) => {
        const db = req.app.get('db');
        req.db = db;
        next();
    })
    .get('/', (req, res, next) => {
        const db = req.db;
        MediaService.selectAllMedia(req.db)
            .then(resultSet => {
                res.send(resultSet);
            })
            .catch(error => {
                console.log(error);
            });
    })
    .post('/', jsonBodyParser, (req, res, next) => {
        const db = req.db;
        const { user_id, media_id } = req.body;
        MediaService.userLikesMedia(db, user_id, media_id)
            .then(result => {
                if(result) {
                    MediaService.deleteUserLikeForMedia(db, user_id, media_id)
                        .then(rowsAffected => {
                            if(rowsAffected != 1) {
                                throw new Error('Error deleting from media_likes');
                            }
                            return res.status(204).end();
                        })
                        .catch(error => {
                            return res.status(400).json({ error: `Like was not removed`});
                        })
                } else {
                    MediaService.insertUserLikeForMedia(db, user_id, media_id)
                        .then(insertedId => {
                            if(!insertedId) {
                                throw new Error('Error inserting to media_likes');
                            }
                            return res.status(204).end();
                        })
                        .catch(error => {
                            return res.status(400).json({ error: `Like was not added`});
                        })
                }
            });
    });

module.exports = mediaRouter;
