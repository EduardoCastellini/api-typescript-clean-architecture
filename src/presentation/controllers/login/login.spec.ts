import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'

interface SutTypes {
  sut: LoginController
}

const makeSut = (): SutTypes => {
  const sut = new LoginController()
  return {
    sut
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const htttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const htttpResponse = await sut.handle(htttpRequest)
    expect(htttpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const htttpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const htttpResponse = await sut.handle(htttpRequest)
    expect(htttpResponse).toEqual(badRequest(new MissingParamError('password')))
  })
})
