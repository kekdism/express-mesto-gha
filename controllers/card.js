import Card from '../models/card.js';

const notFoundError = new Error('Запрашиваемая карточка не найдена');
notFoundError.name = 'NotFound';
notFoundError.message = 'Запрашиваемая карточка не найдена';

export const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate('owner');
    res.send(cards);
  } catch (err) {
    res.status(500).send(err);
  }
};

export const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.user;
    const newCard = await Card.create({ name, link, owner: _id });
    res.send(newCard);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }

    res.status(500).send(err);
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const cardToDelete = await Card.findById({ _id: cardId });
    if (!cardToDelete) {
      throw notFoundError;
    }
    if (cardToDelete.owner !== req.user._id) {
      throw new Error('Не достаточно прав');
    }
    const deleteStatus = await Card.deleteOne({ _id: cardId });
    if (deleteStatus.deletedCount === 0) {
      throw notFoundError;
    }
    res.send(deleteStatus);
  } catch (err) {
    if (err.name === 'NotFound') {
      res.status(404).send({ message: err.message });
      return;
    }
    if (err.name === 'CastError') {
      res.status(400).send({ message: 'Переданы некорректные данные' });
      return;
    }
    console.log(err)
    res.status(500).send({ message: err.message });
  }
};

export const addLike = async (req, res) => {
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
    if (updatedCard === null) {
      throw notFoundError;
    }
    res.send(updatedCard);
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

export const removeLike = async (req, res) => {
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
    if (updatedCard === null) {
      throw notFoundError;
    }
    res.send(updatedCard);
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
