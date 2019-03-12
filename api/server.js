const app = require('./app')

app.listen(process.env.PORT || 5000, () => {
  console.log('App listening to port 5000 check it out on http://127.0.0.1:5000');
});
