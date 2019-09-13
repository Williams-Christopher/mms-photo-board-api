const app = require('../src/app');
const knex = require('knex');
const UsersService = require('../src/users/users-service');
const Helpers = require('../src/helpers/helpers');
const testHelpers = require('./test-helpers');
const { DB_URL } = require('../src/config');


describe(`Users endpoints`, () => {

    before(`create db connection`, () => {
        db = knex({
            client: 'pg',
            connection: DB_URL
        });

        app.set('db', db);
    });

    after(`destroy db connection`, () => db.destroy());
    before(`cleanup`, () => testHelpers.truncateTables(db));

    describe(`POST /api/users`, () => {
        describe(`Validating users`, () => {
            context(`A new user - passing`, () => {
                it(`should create the user given good values including a unique user_name, unique user_phone, and valid password`, () => {
                    let testUser = testHelpers.createUsersArray()[0];
                    testUser.user_phone = '+15124360259';
                    return supertest(app)
                        .post('/api/users')
                        .send(testUser)
                        .expect(204);
                });
            });

            context(`A new user - failing`, () => {
                beforeEach(`seed users`, () => testHelpers.seedUsersTable(db));
                afterEach(`cleanup`, () => testHelpers.truncateTables(db));

                it(`should return 400 'Password does not meet complexity requirements' if user_password is simple`, () => {
                    const testUser = testHelpers.createUsersArray()[0];
                    testUser.user_password = 'SimplePasswordFails';

                    return supertest(app)
                        .post('/api/users')
                        .send(testUser)
                        .expect(400, {error: 'Password does not meet complexity requirements'})
                });

                it(`should return 400 'User name is in use' if user_name exists in users table`, () => {
                    const testUser = testHelpers.createUsersArray()[0];

                    return supertest(app)
                        .post('/api/users')
                        .send(testUser)
                        .expect(400, {error: 'User name is in use'})
                });

                it(`should return 400 'Phone number is in use' if user_phone exists in users table`, () => {
                    const testUser = testHelpers.createUsersArray()[0];
                    testUser.user_name = 'doesnotexist';

                    return supertest(app)
                        .post('/api/users')
                        .send(testUser)
                        .expect(400, {error: 'Phone number is in use'})
                });

                it(`should return 400 'Verification message could not be sent' if the validation text message can not be sent`, () => {
                    const testUser = testHelpers.createUsersArray()[0];
                    testUser.user_name = 'doesnotexist';
                    testUser.user_phone = '+1NotAPhoneNumber'

                    return supertest(app)
                        .post('/api/users')
                        .send(testUser)
                        .expect(400, {error: 'Verification message could not be sent'})
                });

                it(`should delete the new unverified user from the database if the verification message can not be sent`, () => {
                    const testUser = testHelpers.createUsersArray()[0];
                    testUser.user_name = 'doesnotexist';
                    testUser.user_phone = '+1NotAPhoneNumber'

                    return supertest(app)
                        .post('/api/users')
                        .send(testUser)
                        .expect(400, {error: 'Verification message could not be sent'})
                        .expect(res =>
                            db
                                .from('users')
                                .select('*')
                                .where('user_name', testUser.user_name)
                                .then(result =>
                                    expect(result).to.eql([])
                                )
                        );
                });
            });
        });
    });
});