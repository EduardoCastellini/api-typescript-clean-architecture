import { HttpRequest, HttpResponse } from './http'

export interface Middleware {
  handle: (httpResquest: HttpRequest) => Promise<HttpResponse>
}
