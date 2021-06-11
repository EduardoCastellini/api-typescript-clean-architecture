import { AuthMiddleware } from './auth-middleware'
import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'
import { AccountModel } from '../../domain/models/account'

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

interface SutTypes {
  sut: AuthMiddleware
  loadAccountByToken: LoadAccountByToken
}

const makeSut = (): SutTypes => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }

  const loadAccountByToken = new LoadAccountByTokenStub()
  const sut = new AuthMiddleware(loadAccountByToken)
  return {
    sut,
    loadAccountByToken
  }
}

describe('Auth Middleware', () => {
  test('Should Return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct AccessToken', async () => {
    const { sut, loadAccountByToken } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByToken, 'load')
    await sut.handle({ headers: { 'x-access-token': 'any_token' } })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
