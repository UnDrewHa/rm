const app = require('./app');

app.listen(process.env.PORT, () => {
  console.log(`App is running on PORT: ${process.env.PORT}`);
});
