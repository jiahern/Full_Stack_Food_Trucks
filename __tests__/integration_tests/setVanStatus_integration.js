const request = require('supertest');

const app = require('../../app')

/* 
    Test Suite for testing set van status functionality:
*/

describe('Integration test: set van status (send text location and set open)', () => {
    // request.agent in order to create and use sessions
    let agent = request.agent(app);

    // store cookie returned by our app
    // let cookie = null;

    beforeAll(() => agent
        // send a POST request to login
        .post('/vendor/') 
        .set('Content-Type', 'application/x-www-form-urlencoded')
        // send the username and password
        .send({
          name: 'van002',
          password: 'v002',
        })
        .then((res) => {
         }));

    // Test Case 1: Van name = van002
    // set the text location to Luna Park, status as ready-for-orders
    test('Test 1 (set location and status): van002', () => {
        agent.body = {textLocation:'Luna Park', longitudeLocation: '-37.83', latitudeLocation: '144.99'}
        return agent
            .post('/vendor/setVanStatus')
            // .set('Cookie', cookie)
            .then((response) => {
                expect(response.statusCode).toBe(302);
            })
    })

});