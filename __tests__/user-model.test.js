'use strict';

const supergoose = require('@code-fellows/supergoose');

const Model = require('../lib/models/model.js');
const usersSchema = require('../lib/models/user-schema.js');

const UsersModel = new Model(usersSchema);

beforeAll(async () => {
  await UsersModel.create({
    "username":"Test",
    "password":"Password"
  });
});

describe('Testing Model', () => {
  it('can create users', async () => {
    let test = await UsersModel.create({
      "username":"Test",
      "password":"Password",
      "fname":'Positive',
      "lname":'Too'
    });
    
    expect(test.username).toStrictEqual('Test');
    expect(test.fname).toStrictEqual('Positive');
    expect(test.lname).toStrictEqual('Too');
  });

  it('can read all users', async () => {
    let all = await UsersModel.read();
    expect(all.length).toStrictEqual(1);
  });

});