const express = require('express');
const AuthController = require('../controllers/AuthController');

const route = express.Router();

route.post('/signup', AuthController.signup);
route.post('/login', AuthController.login);
route.post('/forgot', AuthController.forgot);
route.post('/reset/:token', AuthController.reset);

//TODO: удалить вообще
route
  .route('/')
  .get(
    AuthController.protect,
    AuthController.restrictedTo(['admin']),
    function (req, res, next) {
      res.send('HELLO FROM ROUTE!!!');
      next();
    },
  );

module.exports = route;
