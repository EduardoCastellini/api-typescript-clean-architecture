import { Controller, EmailValidator, HttpResponse, HttpRequest } from '../protocols'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'

export class SignUpController implements Controller {
  constructor (private readonly emailValidator: EmailValidator) {}

  handle (httpResquest: HttpRequest): HttpResponse {
    try {
      const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']

      for (const fild of requiredFilds) {
        if (!httpResquest.body[fild]) {
          return badRequest(new MissingParamError(fild))
        }
      }

      if (httpResquest.body.password !== httpResquest.body.passwordConfirmation) {
        return badRequest(new InvalidParamError('passwordConfirmation'))
      }

      const isValid = this.emailValidator.isValid(httpResquest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 200,
        body: ''
      }
    } catch (error) {
      return serverError()
    }
  }
}
