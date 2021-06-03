import { InvalidParamError } from '../../errors'
import { Validation } from '../../protocols/validation'
import { EmailValidator } from '../../protocols/email-validator'

export class EmailValidation implements Validation {
  constructor (
    private readonly fildName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  validate (input: any): Error | null {
    const isValid = this.emailValidator.isValid(input[this.fildName])
    if (!isValid) {
      return new InvalidParamError(this.fildName)
    }
    return null
  }
}
