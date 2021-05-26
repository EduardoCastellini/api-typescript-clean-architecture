import { CustomerController } from './customer'
import { MissingParamError } from '../../errors'

interface sutTypes {
  sut: CustomerController
}

const makeSut = (): sutTypes => {
  const sut = new CustomerController()

  return {
    sut
  }
}

describe('SignUp Controller', () => {
  test('Shoud return 400 if no name is provided', () => {
    const { sut } = makeSut()

    const httpResquest = {
      body: {
        corporateName: 'any corporate name',
        email: 'any_email@mail.com',
        cnpj: 99999999999999,
        cpf: 99999999999,
        phone: 999999999999,
        password: 'any password',
        passwordConfirmation: 'any password confirmation',
        sendEmailConfirmation: true
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('name'))
  })
})
