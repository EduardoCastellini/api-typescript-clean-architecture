import { LoginController } from './login'
import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator, HttpRequest } from '../singup/singup-protocols'
import { Authentication } from '../../../domain/usecases/authentication'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAuthentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return await new Promise(resolve => resolve('any_token'))
    }
  }
  return new AuthenticationStub()
}

const mekeHttpResquest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})
interface SutTypes {
  sut: LoginController
  emaiValidatorStub: EmailValidator
  authentication: Authentication
}

const makeSut = (): SutTypes => {
  const emaiValidatorStub = makeEmailValidator()
  const authentication = makeAuthentication()
  const sut = new LoginController(emaiValidatorStub, authentication)
  return {
    sut,
    emaiValidatorStub,
    authentication
  }
}

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const htttpResponse = await sut.handle(httpRequest)
    expect(htttpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const htttpResponse = await sut.handle(httpRequest)
    expect(htttpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('should return 400 if an invalid email is provided', async () => {
    const { sut, emaiValidatorStub } = makeSut()
    jest.spyOn(emaiValidatorStub, 'isValid').mockReturnValueOnce(false)
    const htttpResponse = await sut.handle(mekeHttpResquest())
    expect(htttpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Shoud call EmailValidator with correct email', async () => {
    const { sut, emaiValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emaiValidatorStub, 'isValid')
    await sut.handle(mekeHttpResquest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Shoud return 500 if EmailValidator throws', async () => {
    const { sut, emaiValidatorStub } = makeSut()
    jest.spyOn(emaiValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(mekeHttpResquest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('Shoud call authentication with correct values', async () => {
    const { sut, authentication } = makeSut()
    const authSpy = jest.spyOn(authentication, 'auth')
    await sut.handle(mekeHttpResquest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })
})
