const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../../models/user');
const Sms = require('../../models/sms');

const user1ID = new ObjectID();
const users = [
  {
    _id: user1ID,
    username: 'geofrocker',
    email: 'geofrocker@gmail.com',
    password: '123abc!',
    phone: '0704901090',
    tokens: [
      {
        token: jwt.sign(
          {
            user: { _id: user1ID, username: 'geofrocker', password: '123abc!' },
          },
          config.env.SECRET_KEY,
          {
            expiresIn: '2d',
          },
        ),
      },
    ],
  },
  {
    _id: new ObjectID(),
    username: 'geofrocker2',
    email: 'geofrocker2@gmail.com',
    password: '123abc!',
    phone: '0778582221',
    tokens: [
      {
        token: jwt
          .sign(
            { username: 'geofrocker2', password: '123abc!' },
            config.env.SECRET_KEY,
            {
              expiresIn: '2d',
            },
          )
          .toString(),
      },
    ],
  },
];

const messages = [
  {
    _id: new ObjectID(),
    message: 'hello test',
    date: new Date(),
    to_user: users[0]._id,
    from_user: users[1]._id,
    status: 'unread',
  },
];
const populateUsers = (done) => {
  const userOne = new User(users[0]);
  User.createUser(userOne, (err1, user1) => {
    done();
  });
  const userTwo = new User(users[1]);
  User.createUser(userTwo, (err, user) => {
    done();
  });
};

const populateMessages = (done) => {
  Sms.add(messages[0], (err, message) => {
    done();
  });
};

module.exports = {
  messages,
  users,
  populateUsers,
  populateMessages,
};
