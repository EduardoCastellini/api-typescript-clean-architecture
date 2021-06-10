import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { Middleware, HttpResponse, HttpRequest } from '../protocols'

export class AuthMiddleware implements Middleware {
  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    return forbidden(new AccessDeniedError())
  }
}
