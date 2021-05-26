import { SignUpController } from './signup'
import { InvalidParamError, MissingParamError, ServerError } from '../../errors'
import { EmailValidator, AddAccount, AddAccountModel, AccountModel } from './singup-protocols'

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
    add (account: AddAccountModel): AccountModel {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email@email.com',
        password: 'valid_password'
      }
      return fakeAccount
    }
  }
  return new AddAccountStub()
}

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
  test('Shoud return 400 if no name is provided', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })

  test('Shoud return 400 if no email is provided', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Shoud return 400 if no password is provided', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Shoud return 400 if no password confirmation is provided', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'))
  })

  test('Shoud return 400 if dassword confirmation fails', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'))
  })

  test('Shoud return 400 if an ivalid email is provided', () => {
    const { sut, emaiValidatorStub } = makeSut()
    jest.spyOn(emaiValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'invalid_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new InvalidParamError('email'))
  })

  test('Shoud call EmailValidator with correct emaiil', () => {
    const { sut, emaiValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emaiValidatorStub, 'isValid')
    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpResquest)
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Shoud return 500 if EmailValidator throws', () => {
    const { sut, emaiValidatorStub } = makeSut()
    jest.spyOn(emaiValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Shoud call AddAccount with correct values', () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')

    const httpResquest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    sut.handle(httpResquest)
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })
})
