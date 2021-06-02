import { Controller, HttpRequest, HttpResponse, Authentication, EmailValidator } from './login-protocols'
import { badRequest, ok, serverError, unauthorized } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFilds = ['email', 'password']
      for (const fild of requiredFilds) {
        if (!httpResquest.body[fild]) {
          return badRequest(new MissingParamError(fild))
        }
      }
      const { email, password } = httpResquest.body
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
      const accessToken = await this.authentication.auth(email, password)
      if (!accessToken) {
        return unauthorized()
      }
      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
