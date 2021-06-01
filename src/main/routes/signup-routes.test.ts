import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

const MONGO_URL = process.env.MONGO_URL ? process.env.MONGO_URL : ''

describe('sugnUp routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  beforeEach(async () => {
    const accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

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
