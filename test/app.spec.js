const app = require('../src/app');

describe('App', () => {
    it(`GET /api/* repsonds with 200 and JSON {ok:true}`, () => {
        return supertest(app)
        .get('/api/')
        .expect(200, {ok:true});
    });
});
