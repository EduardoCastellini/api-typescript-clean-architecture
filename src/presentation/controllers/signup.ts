import { HttpResponse, HttpRequest } from '../protocols/http'
import { InvalidParamError, MissingParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { Controller } from '../protocols/controller'
import { EmailValidator } from '../protocols/email-validator'

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

      const email = httpResquest.body.email
      const isValid = this.emailValidator.isValid(email)
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
