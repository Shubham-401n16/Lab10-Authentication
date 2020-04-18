const supergoose = require('@code-fellows/supergoose');
const server = require('../lib/server.js');
const agent = supergoose(server.authServer);
const Users = require('../lib/models/model.js');
const base64 = require('base-64');

describe('test auth', () => {

    it('tset signup',() =>{
        let testObject = {
            username: 'Test',
            password: 'Testing',
        }
        return agent.post('/signup')
        .send(testObject)
        .then(response => {
            expect(response.statusCode).toBe(200);
        });
    });

    it('test signin', () => {
        let testObject = {
            username: 'Test',
            password: 'Testing',
        }

        let hashPassword = base64.encode(testObject.username,testObject.password);
        return agent.post('/signin')
            .send(hashPassword)
            .then(response => {
                expect(response.statusCode).toBe(200);
            })

    })
})