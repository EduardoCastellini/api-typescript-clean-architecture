import { HttpResponse, HttpRequest } from '../protocols/http'
export class SignUpController {
  handle (httpResquest: HttpRequest): HttpResponse {
    if (!httpResquest.body.name) {
      return {
        statusCode: 400,
        body: new Error('Missing param: name')
      }
    }

    if (!httpResquest.body.email) {
      return {
        statusCode: 400,
        body: new Error('Missing param: email')
      }
    }

    return {
      statusCode: 200,
      body: ''
    }
  }
}
