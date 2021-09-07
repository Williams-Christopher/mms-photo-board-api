const express = require('express');
const MediaService = require('./media-service');

const jsonBodyParser = express.json();
const requireAuth = require('../middleware/jwt-auth');
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
                res.status(400).json({error: `There was a unknown error retrieving media records`});
            });
    })
    .post('/', requireAuth, jsonBodyParser, (req, res, next) => {
        const db = req.db;
        const { media_id } = req.body;
        MediaService.userLikesMedia(db, req.userRecord.id, media_id)
            .then(result => {
                if(result) {
                    MediaService.deleteUserLikeForMedia(db, req.userRecord.id, media_id)
                        .then(newLikesCount => {
                            if(!newLikesCount) {
                                throw new Error('Error deleting from media_likes');
                            }
                            const newLikes = newLikesCount[0].likes;
                            return res.json({newLikes: `${newLikes}`});
                        })
                        .catch(error => {
                            return res.status(400).json({ error: `Like was not removed`});
                        })
                } else {
                    MediaService.insertUserLikeForMedia(db, req.userRecord.id, media_id)
                        .then(newLikesCount => {
                            if(!newLikesCount) {
                                throw new Error('Error inserting to media_likes');
                            }
                            const newLikes = newLikesCount[0].likes;
                            return res.json({newLikes: `${newLikes}`});
                        })
                        .catch(error => {
                            return res.status(400).json({ error: `Like was not added`});
                        })
                }
            });
    });

module.exports = mediaRouter;
