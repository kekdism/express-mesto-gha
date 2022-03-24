import User from '../models/user.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

const notFoundError = new Error('Запрашиваемый пользователь не найден');
notFoundError.name = 'NotFound';
notFoundError.message = 'Запрашиваемая карточка не найдена';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId }).select('-__v');
    if (user === null) {
      throw notFoundError;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'NotFound') {
      res.status(404).send({ message: err.message });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send(err);
  }
};

export const getUserByToken = async (req, res) => {
  try {
    const token = req.token;
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById({ _id }).select('-__v');
    if (user === null) {
      throw notFoundError;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'NotFound') {
      res.status(404).send({ message: err.message });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send(err);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, about, avatar, email, password: hashPassword });
    res.send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message });
      return;
    }
    res.status(500).send(err);
  }
};

export const updateUser = async (req, res) => {
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
    ).select("-__v");
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send(err);
  }
};

export const updateUserAvatar = async (req, res) => {
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
    ).select("-__v");
    res.send(updatedUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    res.status(500).send(err);
  }
};

export const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw notFoundError;
    }
    const isPassCorrect = await bcrypt.compare(password, user.password);
    if (!isPassCorrect) {
      throw new Error('Не верный пароль');
    }
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET)
    res.cookie('jwt', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true
    });
    res.send({ _id: user._id });
  } catch (err) {
    res.send({ message: err.message })
  }
}
