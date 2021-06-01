import { Collection } from 'mongodb'
import { MongoHelper } from '../helpers/mongo-helper'
import { LogMongoRepository } from './log'

const MONGO_URL = process.env.MONGO_URL ? process.env.MONGO_URL : ''

describe('Log Mongo Repository', () => {
  let errorCollection: Collection

  beforeAll(async () => {
    await MongoHelper.connect(MONGO_URL)
  })

  afterAll(async () => {
    await MongoHelper.disconnect()
  })

  beforeEach(async () => {
    errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.deleteMany({})
  })

  test('Shoul create an error log on sucess', async () => {
    const sut = new LogMongoRepository()
    await sut.logError('any_error')
    const count = await errorCollection.countDocuments()
    expect(count).toBe(1)
  })
})
