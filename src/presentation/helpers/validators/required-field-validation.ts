import { MissingParamError } from '../../errors'
import { Validation } from '../../protocols/validation'

export class RequeiredFieldValidation implements Validation {
  constructor (private readonly fildName: string) {}

  validate (input: any): Error | null {
    if (!input[this.fildName]) return new MissingParamError(this.fildName)
    return null
  }
}
