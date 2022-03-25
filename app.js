import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import router from './routes/router.js'
import auth from './middlewares/auth.js'
import { login, createUser } from './controllers/user.js'
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';


dotenv.config();

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(cookieParser());
app.use(bodyParser.json());


app.post('/signin', login);
app.post('/signup', createUser)

app.use(auth)

app.use(router);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  console.log(err)
  res.status(statusCode).send(err);
})

//message: statusCode === 500 ? 'На сервере произошла ошибка' : message

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
