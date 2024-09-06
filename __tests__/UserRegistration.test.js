const app = require('../app');
const request = require('supertest');

it('Register a new user', async () => {
    const response = await request(app).post('/users').send({
      firstname: "Student",
      lastname: "Noroff",
      username: "student007",
      password: "asecret"
    })
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('message', 'User created successfully');
    expect(response.body).toHaveProperty('data.token');
});