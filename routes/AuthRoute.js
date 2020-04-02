const express = require('express');
const AuthController = require('../controllers/AuthController');

const route = express.Router();

route.post('/signup', AuthController.signup);
route.post('/login', AuthController.login);
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
