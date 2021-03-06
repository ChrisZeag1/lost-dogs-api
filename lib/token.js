// dependencies
const jwt = require('jsonwebtoken');

// models
const User = require('../models/User');

const validateToken = (token, username, reqUser) => {
  if (!token) {
    return Promise.reject({
      statusCode: 401,
      code: 'No token found.',
    });
  }

  if (!/token [\S]*/.test(token)) {
    return Promise.reject({
      statusCode: 400,
      code: 'Malformed token.',
    });
  }

  return new Promise((resolve, reject) => (
    jwt.verify(token.split(' ')[1], process.env.SESSION_SECRET, { algorithms: ['HS384'] }, (verifyError, jwtPayload) => {
      if (verifyError) {
        return reject({
          statusCode: 401,
          code: 'Not a valid token.',
        });
      }

      if (!jwtPayload.username && reqUser) {
        return reject({
          statusCode: 401,
          code: 'Action requires authenticated user.',
        });
      }

      if (!jwtPayload.username) {
        return resolve(jwtPayload);
      }

      if (username && jwtPayload.username !== username) {
        return reject({
          statusCode: 401,
          code: 'Username doesn\'t match with token.',
        });
      }

      return resolve(jwtPayload);
    })
  ));
};

module.exports.signToken = jwtPayload => (
  new Promise((resolve, reject) => {
    jwt.sign(jwtPayload, process.env.SESSION_SECRET, { algorithm: 'HS384' }, (err, token) => {
      if (err) {
        return reject({
          statusCode: 500,
          code: 'Error signing token.',
        });
      }

      return resolve(token);
    });
  })
);

module.exports.middleware = ({ reqUser }) => (
  (req, res, next) => {
    validateToken(req.headers.Authorization || req.headers.authorization, req.params.username, reqUser)

      .then((jwtPayload) => {
        req.jwtPayload = jwtPayload;
        if (jwtPayload.username) {
          return User.validateToken(jwtPayload)

          .then((user) => {
            req.user = user;

            next();
          });
        }

        return next();
      })

      .catch(err => (
        res.status(err.statusCode).json(err)
      ));
  }
);
