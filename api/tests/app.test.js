/* eslint-disable no-underscore-dangle */
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../api/app');
const {
  users,
  populateUsers,
  populateMessages,
  messages,
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateMessages);

afterAll(() => {
  mongoose.connection.db.dropDatabase();
  mongoose.connection.close();
});
describe('User actions', () => {
  test('it should login user', (done) => {
    request(app)
      .post('/public/auth/login')
      .send({ username: users[0].username, password: users[0].password })
      .then((res) => {
        expect(res.statusCode).toBe(200);
        expect(typeof res.body.token).not.toBe('undefined');
        done();
      });
  });

  test('it should not login unregistered user', (done) => {
    request(app)
      .post('/public/auth/login')
      .send({ username: 'unknown', password: 'unknown' })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(typeof res.body.token).toBe('undefined');
        done();
      });
  });

  test('it should not login user with incorrect password', (done) => {
    request(app)
      .post('/public/auth/login')
      .send({ username: users[0].username, password: 'unknown' })
      .then((res) => {
        expect(res.statusCode).toBe(400);
        expect(typeof res.body.token).toBe('undefined');
        done();
      });
  });

  test('it should register user', (done) => {
    request(app)
      .post('/public/auth/register')
      .send({
        username: 'test',
        email: 'test@gmail.com',
        password: 'test',
        phone: '0778901090',
      })
      .then((res) => {
        expect(res.statusCode).toBe(201);
        expect(typeof res.body).not.toBe('undefined');
        done();
      });
  });

  test('it should send an sms', (done) => {
    request(app)
      .post('/private/send')
      .send({ phone: '0778582221', message: 'Hello test' })
      .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
      .then((response) => {
        expect(response.statusCode).toBe(201);
        expect(response.body.sms.message).toBe('Hello test');
        done();
      });
  });

  test('it should retrieve my messages', (done) => {
    request(app)
      .get('/private/myMessages')
      .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.messages[0].message).toBe('Hello test');
        done();
      });
  });

  test('it should retrieve a message', (done) => {
    request(app)
      .get('/private/message/' + messages[0]._id)
      .set('Authorization', `Bearer ${users[0].tokens[0].token}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.sms.message).toBe('hello test');
        done();
      });
  });
});
