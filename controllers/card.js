import Card from "../models/card.js";

export const getCards = async (req, res) => {
  try {
    const cards = await Card.find({}).populate("owner");
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
    res.status(500).send(err);
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    res.send(await Card.deleteOne({ _id: cardId }));
  } catch (err) {
    res.status(500).send(err);
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
      { new: true }
    ).populate(["owner", "likes"]);
    res.send(updatedCard);
  } catch (err) {
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
      { new: true }
    ).populate(["owner", "likes"]);
    res.send(updatedCard);
  } catch (err) {
    res.status(500).send(err);
  }
};
