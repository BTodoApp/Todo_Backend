const express = require('express');
const app = express();
const middleware = require('./middleware/index');
const { User, Card, List, Board } = require('./models/index')
const cors = require('cors')
const AuthRouter = require('./routes/AuthRouter')
const AppRouter = require('./routes/AppRoutes')
const bodyParser = require('body-parser');
const { seed } = require('./seed')
require('dotenv').config();
seed()

const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json())
app.use(bodyParser.json());


// Define your API routes
app.get('/', (req, res) => res.json({ message: 'Server Works' }))
app.use('/api', AppRouter)
app.use('/auth', AuthRouter)

app.get('/protected', middleware.verifyToken, (req, res) => {
  res.send({ message: `Hello, ${req.user.username}!` });
});

// Route to get all data
app.get('/data', async (req, res) => {
  try {
    const users = await User.findAll({ include: [{ model: Board, include: [{ model: List, include: [{ model: Card }] }] }] });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server

module.exports = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});