const { User, Board, List, Card } = require('../models')

const GetUsers = async (req, res) => {
    try {
    const users = await User.findAll()
    res.send(users)
    } catch (error) {
    throw error
    }
}

const GetUserByPk = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.userid)
        res.send(user)
    } catch (error) {
        throw error
    }
}

const CreateUser = async (req, res) => {
    try {
        let userId = parseInt(req.params.user_id);
        let userBody = {
            userId,
            ...req.body,
        };
        let user = await User.create(userBody);
        res.send(user)
    } catch (error) {
        throw error
    }
}

const UpdateUser = async (req, res) => {
    try{
    let userId = parseInt(req.params.userId);
    let updateUser = await User.update(req.body, {
        where: { id: userId },
        returning: true
    });
    res.send(updateUser)
    } catch (error) {
        throw error
    }
}

const DestroyUser = async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const user = await User.findOne({ where: { id: userId } });
  
      if (!user) {
        return res.status(404).json({ message: `User with id ${userId} not found` });
      }
  
      await User.destroy({ where: { id: userId } });
      
      res.status(200).json({ message: `Deleted user with id ${userId}` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  };
  

const GetAllUserData = async (req, res) => {
    try {
        const users = await User.findAll({ include: [{ model: Board, include: [{ model: List, include: [{ model: Card }] }] }] });
        res.json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
}


module.exports = {
    GetUsers,
    GetUserByPk,
    CreateUser,
    UpdateUser,
    DestroyUser,
    GetAllUserData
}