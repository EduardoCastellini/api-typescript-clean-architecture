import { AccessDeniedError } from '../errors'
import { forbidden } from '../helpers/http/http-helper'
import { Middleware, HttpResponse, HttpRequest } from '../protocols'
import { LoadAccountByToken } from '../../domain/usecases/load-account-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpResquest: HttpRequest): Promise<HttpResponse> {
    const accessToken = httpResquest.headers?.['x-access-token']
    if (accessToken) {
      await this.loadAccountByToken.load(accessToken)
    }

    return forbidden(new AccessDeniedError())
  }
}
