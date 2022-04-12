import jsonwebtoken from 'jsonwebtoken';
import AuthorizationError from '../utils/errors/AuthorizationError.js';

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

const auth = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new AuthorizationError('Требуется авторизация');
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    const { _id } = jsonwebtoken.verify(token, JWT_SECRET);
    req.user = { _id };
    next();
  } catch (err) {
    next(new AuthorizationError('Требуется авторизация'));
  }
};

export default auth;
