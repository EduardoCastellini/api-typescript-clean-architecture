import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

const MONGO_URL = process.env.MONGO_URL ? process.env.MONGO_URL : ''
let accountCollection: Collection

describe('Login Routes', () => {
  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  beforeEach(async () => {
    accountCollection = await MongoHelper.getCollection('accounts')
    await accountCollection.deleteMany({})
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  describe('POST /signup', () => {
    test('Shoul return 200 on signup ', async () => {
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

  describe('POST /login', () => {
    test('Shoul return 200 on login ', async () => {
      const password = await hash('123', 12)
      await accountCollection.insertOne({
        name: 'Eduardo',
        email: 'eduardo@test.com.br',
        password
      })
      await request(app)
        .post('/api/login')
        .send({
          email: 'eduardo@test.com.br',
          password: '123'
        })
        .expect(200)
    })
  })
})
