import { LoginController } from './login'
import { badRequest, serverError, unauthorized } from '../../helpers/http-helper'
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
    async auth (email: string, password: string): Promise<string|null> {
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
  authenticationStub: Authentication
}

const makeSut = (): SutTypes => {
  const emaiValidatorStub = makeEmailValidator()
  const authenticationStub = makeAuthentication()
  const sut = new LoginController(emaiValidatorStub, authenticationStub)
  return {
    sut,
    emaiValidatorStub,
    authenticationStub
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
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mekeHttpResquest())
    expect(authSpy).toHaveBeenCalledWith('any_email@mail.com', 'any_password')
  })

  test('Shoud return 401 if Invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(mekeHttpResquest())
    expect(httpResponse).toEqual(unauthorized())
  })
})
