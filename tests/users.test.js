const request = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../index');
const User = require('../models/User');
const dotenv = require('dotenv');
dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

describe('User endpoints', () => {

  it('should get all users', async () => {
    const res = await request(app)
      .get('/api/users');
    expect(res.statusCode).toEqual(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should create a new user', async () => {
    const password = 'testpassword';
    const hash = await bcrypt.hash(password, 10);
    const res = await request(app)
      .post('/api/users')
      .send({
        name: 'testuser2',
        email: 'testuser2@example.com',
        password: hash
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual('testuser2');
  });

  it('should update an existing user', async () => {
    // Create a user for testing purposes
    const testUser = {
      email: 'test@example.com',
      password: 'testpassword',
      name: 'testuser'
    };
    const createdUser = await User.create(testUser);

    // Sign the JWT token
    const secretKey = SECRET_KEY;
    const payload = { userId: createdUser.id };
    const options = { expiresIn: '1h' };
    const token = jwt.sign(payload, secretKey, options);
  
    // Update the user's password
    const res = await request(app)
    .put(`/api/users/edit/${createdUser.id}`)
    .send({
      password: 'newpassword'
      })
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.password).not.toEqual(createdUser.password);

  });

  it('should delete a user', async () => {

    // Delete the user
    const createdUser = await User.findOne({ where: { email: 'testuser2@example.com' } });
    const deleteRes = await request(app)
      .delete(`/api/users/${createdUser.id}`)
    expect(deleteRes.statusCode).toEqual(200);
    const deletedUser = await User.findByPk(createdUser.id);
    expect(deletedUser).toBeNull();
  });
  
});
