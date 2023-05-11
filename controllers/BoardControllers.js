const { Board } = require('../models');

const getBoards = async (req, res) => {
  try {
    const boards = await Board.findAll();
    res.send(boards);
  } catch (error) {
    throw error;
  }
};

const getBoardById = async (req, res) => {
  try {
    const board = await Board.findByPk(req.params.boardId);
    res.send(board);
  } catch (error) {
    throw error;
  }
};

const createBoard = async (req, res) => {
  try {
    let boardId = parseInt(req.params.boardId);
    let boardBody = {
      boardId,
      ...req.body,
    };
    let board = await Board.create(boardBody);
    res.send(board);
  } catch (error) {
    throw error;
  }
};

const updateBoard = async (req, res) => {
  try {
    let boardId = parseInt(req.params.boardId);
    let updateBoard = await Board.update(req.body, {
      where: { id: boardId },
      returning: true,
    });
    res.send(updateBoard);
  } catch (error) {
    throw error;
  }
};

const deleteBoard = async (req, res) => {
  try {
    let boardId = parseInt(req.params.boardId);
    await Board.destroy({
      where: { id: boardId },
    });
    res.send({ message: `Deleted a board with an id of ${boardId}` });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getBoards,
  getBoardById,
  createBoard,
  updateBoard,
  deleteBoard,
};
