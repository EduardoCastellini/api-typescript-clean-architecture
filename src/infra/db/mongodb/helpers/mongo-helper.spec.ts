import { MongoHelper as sut } from './mongo-helper'

const MONGO_URL = process.env.MONGO_URL ? process.env.MONGO_URL : ''

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  test('Should reconect if mongosb is down', async () => {
    let accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
    await sut.disconnect()
    accountCollection = await sut.getCollection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
