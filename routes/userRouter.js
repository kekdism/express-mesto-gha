import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  updateUserAvatar,
  getUserByToken
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.get("/me", getUserByToken);
router.get("/:userId", getUserById);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateUserAvatar);

export default router;
