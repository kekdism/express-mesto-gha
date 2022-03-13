import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserAvatar,
} from "../controllers/user.js";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);
router.patch("/me", updateUser);
router.patch("/me/avatar", updateUserAvatar);

export default router;
