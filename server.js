const mongoose = require('mongoose');
const app = require('./app');

const CONNECTION_STRING = process.env.CONNECTION_STRING.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
);

mongoose.connect(CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.listen(process.env.PORT, () => {
  console.log(`App is running on PORT: ${process.env.PORT}`);
});
