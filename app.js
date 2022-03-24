import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'
import router from './routes/router.js'
import auth from './middlewares/auth.js'
import { login, createUser } from './controllers/user.js'
import cookieParser from 'cookie-parser';


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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
