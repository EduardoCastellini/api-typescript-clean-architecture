import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest, ok, serverError } from '../../helpers/http-helper'
import { InvalidParamError, MissingParamError } from '../../errors'
import { EmailValidator } from '../singup/singup-protocols'
import { Authentication } from '../../../domain/usecases/authentication'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator,
    private readonly authentication: Authentication
  ) {}

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpResquest.body
      if (!email) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('email'))))
      }
      if (!password) {
        return await new Promise(resolve => resolve(badRequest(new MissingParamError('password'))))
      }
      const isValid = this.emailValidator.isValid(email)
      if (!isValid) {
        return await new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))))
      }

      await this.authentication.auth(email, password)
      return await new Promise(resolve => resolve(ok('')))
    } catch (error) {
      return serverError(error)
    }
  }
}
