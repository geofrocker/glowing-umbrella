module.exports = {
  'POST /send': 'SmsController.sendSms',
  'DELETE /deleteUser/:id': 'UserController.deleteUser',
  'DELETE /deleteSms/:id': 'SmsController.deleteSms',
  'GET /myMessages/': 'SmsController.getMyMessages',
  'GET /message/:id': 'SmsController.getMessage',
};
