import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import AuthorizationError from '../utils/errors/AuthorizationError.js';
import DuplicateError from '../utils/errors/DuplicateError.js';
import NotFoundError from '../utils/errors/NotFoundError.js';

const { JWT_SECRET = 'JWT_SECRET' } = process.env;

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-__v');
    res.send(users);
  } catch (err) {
    next(err);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId }).select('-__v');
    if (!user) {
      throw new NotFoundError('Такого пользователя не существует');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const user = await User.findById({ _id }).select('-__v');
    if (!user) {
      throw new NotFoundError('Такого пользователя не существует');
    }
    res.send(user);
  } catch (err) {
    next(err);
  }
};

export const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    let newUser = await User.create({
      name, about, avatar, email, password: hashPassword,
    });
    newUser = JSON.parse(JSON.stringify(newUser));
    newUser = Object.fromEntries(Object.entries(newUser).filter(([key]) => key !== 'password'));
    res.send(newUser);
  } catch (err) {
    if (err.code === 11000) {
      next(new DuplicateError('Такой пользователь уже существет'));
    }
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const { _id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    ).select('-__v');
    res.send(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const { _id } = req.user;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    ).select('-__v');
    res.send(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new AuthorizationError('Не верный email');
    }
    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      throw new AuthorizationError('Не верный пароль');
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET);
    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.send({ _id: user._id });
  } catch (err) {
    next(err);
  }
};
