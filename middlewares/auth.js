import jsonwebtoken from 'jsonwebtoken';
import { AuthorizationError } from '../utils/errors.js'

const auth = (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      throw new AuthorizationError('Требуется авторизация')
    }
    const { _id } = jsonwebtoken.verify(req.cookies.jwt, process.env.JWT_SECRET);
    req.user = { _id };
    next();
  } catch (err) {
    next(err);
  }
}

export default auth;