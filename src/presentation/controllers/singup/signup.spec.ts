import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './singup-protocols'
import { HttpRequest } from '../../protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password'
})

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})
interface sutTypes {
  sut: SignUpController
  addAccountStub: AddAccount
  emaiValidatorStub: EmailValidator
}

const makeSut = (): sutTypes => {
  const emaiValidatorStub = makeEmailValidator()
  const addAccountStub = makeAddAccount()
  const sut = new SignUpController(emaiValidatorStub, addAccountStub)

  return {
    sut,
    addAccountStub,
    emaiValidatorStub
  }
}

describe('SignUp Controller', () => {
  test('Shoud return 400 if no name is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('name')))
  })

  test('Shoud return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')))
  })

  test('Shoud return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')))
  })

  test('Shoud return 400 if no password confirmation is provided', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')))
  })

  test('Shoud return 400 if password confirmation fails', async () => {
    const { sut } = makeSut()
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpResquest)
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')))
  })

  test('Shoud return 400 if an ivalid email is provided', async () => {
    const { sut, emaiValidatorStub } = makeSut()
    jest.spyOn(emaiValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('Shoud call EmailValidator with correct email', async () => {
    const { sut, emaiValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emaiValidatorStub, 'isValid')
    await sut.handle(makeFakeRequest())
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Shoud return 500 if EmailValidator throws', async () => {
    const { sut, emaiValidatorStub } = makeSut()
    jest.spyOn(emaiValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('Shoud return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('')))
  })

  test('Shoud call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Shoud return 200 if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })
})
