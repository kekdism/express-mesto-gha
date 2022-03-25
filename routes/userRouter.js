import { celebrate, Segments } from 'celebrate';
import express from "express";
import Joi from 'joi';
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getCurrentUser
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", getCurrentUser);
router.get("/:userId", getUserById);
router.patch("/me", celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  })
}), updateUser);
router.patch("/me/avatar", celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().pattern(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)/),
  })
}), updateUserAvatar);

export default router;
