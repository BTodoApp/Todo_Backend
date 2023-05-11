const { Board, List, Card, User } = require('./models/index');
const { db } = require('./models/index')

const seed = async () => {
    await db.sync({ force: true }); // clear out database + tables
  
    // Create a user
    const user = await User.create({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "password123",
    });
  
    // Create a board for the user
    const board = await Board.create({
      title: "My First Board",
      userId: user.id,
    });
  
    // Create a list for the board
    const list = await List.create({
      name: "To Do",
      order: 1,
      boardId: board.id,
    });
  
    // Create a card for the list
    const card = await Card.create({
      title: "Buy groceries",
      description: "Milk, eggs, bread",
      order: 1,
      listId: list.id,
      userId: user.id,
    });
  
    console.log("Seed data added successfully");
  };

  module.exports = {
    seed
  }