import jsonwebtoken from 'jsonwebtoken';
import AuthorizationError from '../utils/errors/AuthorizationError.js';

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

const auth = (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      throw new AuthorizationError('Требуется авторизация');
    }
    const { _id } = jsonwebtoken.verify(req.cookies.jwt, JWT_SECRET);
    req.user = { _id };
    next();
  } catch (err) {
    next(err);
  }
};

export default auth;
