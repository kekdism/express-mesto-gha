import User from "../models/user.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById({ _id: userId });
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
    res.send(newUser);
  } catch (err) {
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
    res.status(500).send(err);
  }
};
