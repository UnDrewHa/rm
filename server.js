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

const server = app.listen(process.env.PORT, () => {
  console.log(`App is running on PORT: ${process.env.PORT}`);
});

function handleUnhandled(error) {
  console.error(error);

  server.close(() => {
    process.exit(1);
  });
}

process.on('uncaughtException', handleUnhandled);
process.on('unhandledRejection', handleUnhandled);
