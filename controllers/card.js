import Card from '../models/card.js';
import NotFoundError from '../utils/errors/NotFoundError.js';
import PermissionError from '../utils/errors/PermissionError.js';

export const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']).sort({ createdAt: -1 });
    res.send(cards);
  } catch (err) {
    next(err);
  }
};

export const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.user;
    const { _id: cardId } = await Card.create({ name, link, owner: _id });
    const newCard = await Card.findById({ _id: cardId }).populate(['owner', 'likes']);
    res.send(newCard);
  } catch (err) {
    next(err);
  }
};

export const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const cardToDelete = await Card.findById({ _id: cardId });
    if (!cardToDelete) {
      throw new NotFoundError('Не верный номер карточки');
    }
    if (!cardToDelete.owner.equals(req.user._id)) {
      throw new PermissionError('Не достаточно прав');
    }
    const deleteStatus = await Card.deleteOne({ _id: cardId });
    res.send(deleteStatus);
  } catch (err) {
    next(err);
  }
};

export const addLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $addToSet: { likes: _id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!updatedCard) {
      throw new NotFoundError('Не верный номер карточки');
    }
    res.send(updatedCard);
  } catch (err) {
    next(err);
  }
};

export const removeLike = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const { _id } = req.user;
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $pull: { likes: _id },
      },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!updatedCard) {
      throw new NotFoundError('Не верный номер карточки');
    }
    res.send(updatedCard);
  } catch (err) {
    next(err);
  }
};
