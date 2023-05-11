const { List } = require('../models')

const getLists = async (req, res) => {
  try {
    const lists = await List.findAll()
    res.send(lists)
  } catch (error) {
    throw error
  }
}

const getListByPk = async (req, res) => {
  try {
    const list = await List.findByPk(req.params.listid)
    res.send(list)
  } catch (error) {
    throw error
  }
}

const createList = async (req, res) => {
  try {
    let listBody = {
      ...req.body,
      boardId: parseInt(req.params.boardid)
    }
    let list = await List.create(listBody)
    res.send(list)
  } catch (error) {
    throw error
  }
}

const updateList = async (req, res) => {
  try {
    let listId = parseInt(req.params.listid)
    let updateList = await List.update(req.body, {
      where: { id: listId },
      returning: true
    })
    res.send(updateList)
  } catch (error) {
    throw error
  }
}

const deleteList = async (req, res) => {
  try {
    let listId = parseInt(req.params.listid)
    await List.destroy({
      where: { id: listId },
    })
    res.send({ message: `deleted a list with an id of ${listId}` });
  } catch (error) {
    throw error
  }
}

module.exports = {
  getLists,
  getListByPk,
  createList,
  updateList,
  deleteList,
}
