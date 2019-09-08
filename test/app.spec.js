const app = require('../src/app');

describe('App', () => {
    it.skip('GET / responds with 200 contaning "Hello, world!"', () => {
        return supertest(app)
            .get('/')
            .expect(200, 'Hello, world!');
    });

    it(`GET /api/* repsonds with 200 and JSON {ok:true}`, () => {
        return supertest(app)
        .get('/api/')
        .expect(200, {ok:true});
    });
});
