import { LoginController } from './login'
import { badRequest, serverError } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { EmailValidator, HttpRequest } from '../singup/singup-protocols'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
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
}

const makeSut = (): SutTypes => {
  const emaiValidatorStub = makeEmailValidator()
  const sut = new LoginController(emaiValidatorStub)
  return {
    sut,
    emaiValidatorStub
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
})
