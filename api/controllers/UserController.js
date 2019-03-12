const jwt = require('jsonwebtoken');
const config = require('../config/');
const User = require('../models/user');
const Sms = require('../models/sms');

const UserController = () => {
  const register = (req, res) => {
    const newUser = new User(req.body);
    User.createUser(newUser, async (err, user) => {
      if (err && err.code === 11000) {
        res.status(400).send({
          message: 'User with the same name or email already exists',
        });
      } else if (err) {
        res.status(422).send({ error: err.message });
      } else {
        await jwt.sign(
          {
            user: {
              _id: user._id,
              username: user.username,
              password: user.password,
            },
          },
          config.env.SECRET_KEY,
          { expiresIn: '2d' },
          (error, token) => {
            if (err) throw err;
            user.tokens.push({ token });
            user.save();
          },
        );
        res.status(201).send(user);
      }
    });
  };

  const login = (req, res) => {
    User.getUserByUsername(req.body.username, (err, user) => {
      if (err) throw err;
      if (!user) {
        res.status(400).send({ message: 'Unknown User' });
      } else {
        User.comparePassword(
          req.body.password,
          user.password,
          (err2, isMatch) => {
            if (err2) throw err2;
            if (isMatch === false) {
              res.status(400).send({ message: 'Invalid password' });
            } else {
              jwt.sign(
                {
                  user: {
                    _id: user._id,
                    username: user.username,
                    password: user.password,
                  },
                },
                config.env.SECRET_KEY,
                { expiresIn: '2d' },
                (error, token) => {
                  if (err) throw err;
                  res.json({ token });
                },
              );
            }
          },
        );
      }
    });
  };

  const deleteUser = (req, res) => {
    User.findById(req.params.id, (err, user) => {
      if (!user) {
        res.status(404).send({ message: 'User not found' });
      } else {
        user.remove();
        res.status(201).send({ message: 'User deleted successfully' });
      }
    });
  };
  return {
    register,
    login,
    deleteUser,
  };
};
module.exports = UserController;
