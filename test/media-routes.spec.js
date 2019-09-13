const knex = require('knex');
const app = require('../src/app');

const testHelpers = require('./test-helpers');
const { DB_URL } = require('../src/config');

describe(`Media endpoints`, () => {
    before(`create db connection`, () => {
        db = knex({
            client: 'pg',
            connection: DB_URL,
        });
        app.set('db', db);
    });

    after(`destroy db connection`, () => db.destroy());
    before(`cleanup`, () => testHelpers.truncateTables(db));

    describe(`GET /api/media`, () => {
        beforeEach(`insert test media`, () => testHelpers.seedAllTables(db));
        afterEach(`clean tables`, () => testHelpers.truncateTables(db));
        
        it(`returns 200 and an array of all the test media`, () => {
            return supertest(app)
                .get('/api/media')
                .expect(200)
                .expect(res => {
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.equal(8);
                    expect(res.body[0]).to.have.all.keys(
                        'id',
                        'user_id',
                        'media_url',
                        'media_caption',
                        'media_location',
                        'created',
                        'likes'
                    );
                })
        });
    });

    describe(`POST /api/media`, () => {
        beforeEach(`insert test media`, () => testHelpers.seedAllTables(db));
        afterEach(`clean tables`, () => testHelpers.truncateTables(db));

        it(`given user_id and media_id existing in media_likes, deletes the 'like'`, () => {
            const existingLikeRecord = {user_id: 1, media_id: 1};
            return supertest(app)
                .post('/api/media')
                .send(existingLikeRecord)
                .expect(204)
                .expect(res => {
                    return db
                        .from('media_likes')
                        .select('id')
                        .where(existingLikeRecord)
                        .then(result => {
                            expect(result).to.be.an('array');
                            expect(result.length).to.equal(0);
                        })
                });
        });

        it(`given user_id and media_id that don't exist in media_likes, adds a new 'like'`, () => {
            const newLikeRecord = {user_id: 1, media_id: 2};
            return supertest(app)
                .post('/api/media')
                .send(newLikeRecord)
                .expect(204)
                .expect(res => {
                    return db
                        .from('media_likes')
                        .select('*')
                        .where(newLikeRecord)
                        .then(result => {
                            expect(result).to.be.an('array');
                            expect(result.length).to.equal(1);
                            expect(result[0]).to.have.property('id');
                            expect(result[0].user_id).to.equal(1);
                            expect(result[0].media_id).to.equal(2);
                        });
                });
        });
    });
});
