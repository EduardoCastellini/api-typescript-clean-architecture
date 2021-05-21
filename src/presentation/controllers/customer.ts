import { Controller, HttpResponse, HttpRequest } from '../protocols'
import { MissingParamError } from '../errors'
import { badRequest } from '../helpers/http-helper'

export class CustomerController implements Controller {
  handle (httpResquest: HttpRequest): HttpResponse {
    if (!httpResquest.body.name) {
      return badRequest(new MissingParamError('name'))
    }

    return {
      statusCode: 200,
      body: 'Cliente Cadastrado com sucesso'
    }
  }
}
