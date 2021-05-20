import { SignUpController } from './signup'

describe('SignUp Controller', () => {
  test('Shoud return 400 if no name is provided', () => {
    const sut = new SignUpController()

    const httpResquest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }

    const httpResponse = sut.handle(httpResquest)

    expect(httpResponse.statusCode).toBe(400)
  })
})
