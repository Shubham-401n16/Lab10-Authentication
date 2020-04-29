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
            email:'bUser@test.com'
        });

        expect(response.status).toBe(201);
        //expect(response.body.username).toStrictEqual('bUser')
        //expect(response.body.email).toStrictEqual('bUser@test.com')
    });

    it('cannot  create existing user', async () => {
      let response = await mockRequest.post('/signup').send({
          username: 'Test',
          password: 'bPass',
      });

      expect(response.status).toBe(500);
      //expect(response.body.message).toStrictEqual('Username has to be unique');
  });

    it('valid user can signin', async () => {
        let response = await mockRequest.post('/signin').auth('Test:Password');
        expect(response.body.token).toBeTruthy();
      });

});

describe('user endpoint', () => {
  it('authorizes users via token', async () => {
    let userData = await mockRequest.post('/signin').auth('Test:Password');
    let token = userData.body.token;
  
    let response = await mockRequest.get('/users').set('Authorization', `Bearer ${token}`);
  
    expect(response.body.user).toStrictEqual('Test');
  });
});