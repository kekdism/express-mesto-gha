import User from "../models/user.js";

const notFoundError = new Error("Запрашиваемый пользователь не найден");
notFoundError.name = "NotFound";
notFoundError.message = "Запрашиваемая карточка не найдена";

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
    const user = await User.findById({ _id: userId });
    if (user === null) {
      throw notFoundError;
    }
    res.send(user);
  } catch (err) {
    if (err.name === "NotFound") {
      res.status(404).send({ message: err.message });
      return;
    }
    if (err.name === "CastError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
      return;
    }
    res.status(500).send(err);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.send(newUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
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
      }
    );
    res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
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
      }
    );
    res.send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      res.status(400).send({ message: "Переданы некорректные данные" });
      return;
    }
    res.status(500).send(err);
  }
};
