import express from 'express';
import NotFoundError from '../utils/errors/NotFoundError.js';

import cardRouter from './cardRouter.js';
import userRouter from './userRouter.js';

const router = express.Router();

router.use('/cards', cardRouter);
router.use('/users', userRouter);
router.use('*', (req, res, next) => next(new NotFoundError('Запрошенная страница не существует')));

export default router;
