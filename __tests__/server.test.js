const supergoose = require('@code-fellows/supergoose');
const serverObj = require('../lib/server.js');
const Model = require('../lib/models/model.js');
const schema = require('../lib/models/user-schema.js');
const UserModel = new Model(schema);

// create our mock server from the imported server
const mockRequest = supergoose(serverObj.server);

beforeAll(async () => {
    await UserModel.create({
      "username": "Test",
      "password": "Password"
    });
  
  });

describe('happy path', () => {
    it('can create a user', async () => {
        let response = await mockRequest.post('/signup').send({
            username: 'bUser',
            password: 'bPass',
            fname: 'Bill',
            lname: 'Biggs',
        });

        expect(response.status).toBe(200);

        expect(response.body._id).toBeDefined();

        expect(response.body.password).toBeDefined();
        expect(response.body.password).not.toBe('bPass');
    });

    it('valid user can signin', async () => {
        let response = await mockRequest.post('/signin').auth('Test:Password');
        expect(response.text).toStrictEqual('found!');
      });
});