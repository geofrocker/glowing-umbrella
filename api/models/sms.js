/* eslint-disable no-param-reassign */
/* eslint-disable func-names */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const SmsSchema = new Schema({
  message: {
    type: String,
    required: [true, 'Message field is required'],
  },
  date: {
    type: Date,
    default: new Date().toLocaleDateString('en-US', options),
  },
  to_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  from_user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    default: 'unread',
  },
});

const Sms = mongoose.model('sms', SmsSchema);
module.exports = Sms;

module.exports.add = (sms, callback) => {
  Sms.create(sms, callback);
};

module.exports.getLocationById = function (_id, callback) {
  const query = { _id };
  Sms.findOne(query).exec(callback);
};
