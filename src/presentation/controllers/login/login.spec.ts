import { LoginController } from './login'
import { badRequest } from '../../helpers/http-helper'
import { MissingParamError } from '../../errors/missing-param-error'

describe('Login Controller', () => {
  test('should return 400 if no email is provided', async () => {
    const sut = new LoginController()
    const htttpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const htttpResponse = await sut.handle(htttpRequest)
    expect(htttpResponse).toEqual(badRequest(new MissingParamError('email')))
  })
})
