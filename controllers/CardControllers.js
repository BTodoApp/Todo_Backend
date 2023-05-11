const { Card } = require('../models');

const getCards = async (req, res) => {
  try {
    const cards = await Card.findAll();
    res.send(cards);
  } catch (error) {
    throw error;
  }
};

const getCardById = async (req, res) => {
  try {
    const card = await Card.findByPk(req.params.cardid);
    res.send(card);
  } catch (error) {
    throw error;
  }
};

const createCard = async (req, res) => {
  try {
    let cardId = parseInt(req.params.card_id);
    let cardBody = {
      cardId,
      ...req.body,
    };
    let card = await Card.create(cardBody);
    res.send(card);
  } catch (error) {
    throw error;
  }
};

const updateCard = async (req, res) => {
  try {
    let cardId = parseInt(req.params.cardid);
    let updateCard = await Card.update(req.body, {
      where: { id: cardId },
      returning: true,
    });
    res.send(updateCard);
  } catch (error) {
    throw error;
  }
};

const deleteCard = async (req, res) => {
  try {
    let cardId = parseInt(req.params.cardid);
    await Card.destroy({
      where: { id: cardId },
    });
    res.send({ message: `Deleted a card with an id of ${cardId}` });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
};
