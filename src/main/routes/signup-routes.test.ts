import request from 'supertest'
import app from '../config/app'

describe('sugnUp routes', () => {
  test('Shoul return an account on success ', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Eduardo',
        email: 'eduardo@test.com.br',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
