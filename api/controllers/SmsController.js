/* eslint-disable no-underscore-dangle */
const User = require('../models/user');
const Sms = require('./../models/sms');

const SmsController = () => {
  const sendSms = (req, res) => {
    User.findOne({ phone: req.body.phone }, (err, toUser) => {
      if (err) res.status(500).send({ err });
      if (toUser) {
        req.body.to_user = toUser._id;
        req.body.from_user = req.userId;
        User.findOne({ _id: req.userId }, (err2, fromUser) => {
          if (err2) res.status(500).send({ err2 });
          Sms.create(req.body, (error, sms) => {
            if (error) res.status(500).send({ error: error.message });
            toUser.messages.push(sms);
            toUser.save();
            fromUser.messages.push(sms);
            fromUser.save();
            res.status(201).send({ sms });
          });
        });
      } else {
        res.status(400).send({
          message:
            'The user you are trying to send the message to is not registered. Please make sure the phone number is registered',
        });
      }
    });
  };

  const getMyMessages = (req, res) => {
    User.getUserById(req.userId, (err, user) => {
      if (!err) {
        res.status(200).send({ messages: user.messages });
      }
    });
  };

  const getMessage = (req, res) => {
    Sms.findById(req.params.id, (err, sms) => {
      if (!err) {
        if (toString(sms.to_user) === toString(req.userId)) {
          sms.status = 'read';
          sms.save();
        }
        res.status(200).send({ sms });
      }
    });
  };

  const deleteSms = (req, res) => {
    Sms.findById(req.params.id, (err, sms) => {
      if (!sms) {
        res.status(404).send({ message: 'Sms not found' });
      } else {
        User.findById(req.userId, (err2, user) => {
          if (!user) {
            res.status(404).send({ message: 'User not found' });
          } else {
            user.messages.pull({ _id: req.params.id });
            user.save();
            sms.remove();
            sms.remove();
            res.status(201).send({ message: 'Sms deleted successfully' });
          }
        });
      }
    });
  };

  return {
    sendSms,
    deleteSms,
    getMyMessages,
    getMessage,
  };
};

module.exports = SmsController;
