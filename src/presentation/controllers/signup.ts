import { HttpResponse, HttpRequest } from '../protocols/http'
import { MissingParamError } from '../errors/missing-param-error'
import { badRequest } from '../helpers/http-helper'
export class SignUpController {
  handle (httpResquest: HttpRequest): HttpResponse {
    const requiredFilds = ['name', 'email', 'password', 'passwordConfirmation']

    for (const fild of requiredFilds) {
      if (!httpResquest.body[fild]) {
        return badRequest(new MissingParamError(fild))
      }
    }

    return {
      statusCode: 200,
      body: ''
    }
  }
}
