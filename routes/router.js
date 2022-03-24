import express from 'express';
import cardRouter from './cardRouter.js';
import userRouter from './userRouter.js';

const router = express.Router();


router.use('/cards', cardRouter);
router.use('/users', userRouter);
router.use('*', (req, res) => res.status(404).send({ message: 'Страница не существует' }));

export default router