const knex = require('knex');
const app = require('../src/app');

const testHelpers = require('./test-helpers');
const { DB_URL } = require('../src/config');

describe(`Auth endpoints`, () => {
    before(`create db connection`, () => {
        db = knex({
            client: 'pg',
            connection: DB_URL,
        });
        app.set('db', db);
    });

    after(`destroy db connection`, () => db.destroy());
    before(`cleanup`, () => testHelpers.truncateTables(db));

    describe(`POST /api/auth`, () => {
        context(`when given an improper request body`, () => {
            const invalidRequest = {};
            it(`responds with 400 and 'Missing user_name in request body' when not given a user`, () => {
                return supertest(app)
                    .post('/api/auth')
                    .send(invalidRequest)
                    .expect(400, {error: `Missing user_name in request body`});
            })

            it(`responds with 400 and 'Missing password in request body' when not given a password`, () => {
                invalidRequest.user_name = 'invalidUser';

                return supertest(app)
                .post('/api/auth')
                .send(invalidRequest)
                .expect(400, {error: `Missing password in request body`});
            });
        });

        context(`when given a proper request body with invalid values`, () => {
            beforeEach(`seed users table`, () => testHelpers.seedUsersTable(db));
            afterEach(`truncate tables`, () => testHelpers.truncateTables(db));
            const { user_name, user_password } = testHelpers.createUsersArray()[0];

            it(`reponds 400 and 'Invalid user name or password' when given a bad user_name`, () => {
                const testUser = {
                    user_name: 'invalid-user',
                    password: user_password,
                };

                return supertest(app)
                    .post('/api/auth')
                    .send(testUser)
                    .expect(400, { error: `Invalid user name or password` });
            });

            it(`responds 400 and 'Invalid user name or password when given a bad password`, () => {
                const testUser = {
                    user_name: user_name,
                    password: 'invalid-password',
                };
                
                return supertest(app)
                    .post('/api/auth')
                    .send(testUser)
                    .expect(400, { error: `Invalid user name or password` });
            });
        });

        context(`when given a proper request body with valid values`, () => {
            beforeEach(`seed users table`, () => testHelpers.seedUsersTable(db));
            afterEach(`truncate tables`, () => testHelpers.truncateTables(db));

            it(`provided valid user_name and password but user has not verified their phone, returns 409 'User has not verified phone'`, () => {
                const { user_name, user_password } = testHelpers.createUsersArray()[1];
                const testUser = {
                    user_name: user_name,
                    password: user_password,
                };

                return supertest(app)
                    .post('/api/auth')
                    .send(testUser)
                    .expect(409, { error: `User has not verified phone` });
            })

            it(`returns a proper bearer auth token when given a good user_name and password`, () => {
                const { user_name, user_password } = testHelpers.createUsersArray()[0];
                const testUser = {
                    user_name: user_name,
                    password: user_password,
                };

                return supertest(app)
                    .post('/api/auth')
                    .send(testUser)
                    .expect(200, /authToken/)
                    .expect('Content-Length', '147');
            });
        });
    });
});
