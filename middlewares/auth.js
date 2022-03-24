import jsonwebtoken from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      throw new Error('Требуется авторизация');
    }
    const { _id } = jsonwebtoken.verify(req.cookies.jwt, process.env.JWT_SECRET);
    req.user = { _id };
    next();
  } catch (err) {
    next();
  }

}

export default auth;