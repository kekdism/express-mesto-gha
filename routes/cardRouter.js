import express from "express";
import {
  addLike,
  createCard,
  deleteCard,
  removeLike,
  getCards,
} from "../controllers/card.js";

const router = express.Router();

router.get("/", getCards);
router.post("/", createCard);
router.delete("/:cardId", deleteCard);
router.put("/:cardId/likes", addLike);
router.delete("/:cardId/likes", removeLike);

export default router;
