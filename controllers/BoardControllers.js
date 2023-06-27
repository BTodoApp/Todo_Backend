const { Board, List } = require('../models');

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

const getBoardsLists = async (req, res) => {
  try {
    const boards = await Board.findAll({
      include: [{ model: List }],
    });
    res.json(boards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const createBoard = async (boardData) => {
  try {
    const { title, userId } = boardData;
    
    // Create the board
    const board = await Board.create({ title, userId });

    // Create default lists for the board
    const lists = await List.bulkCreate([
      { name: 'To Do', order: 1, boardId: board.id },
      { name: 'Doing', order: 2, boardId: board.id },
      { name: 'Done', order: 3, boardId: board.id },
    ]);

    // Associate the lists with the board
    await board.setLists(lists);

    return board;
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
  getBoardsLists
};
