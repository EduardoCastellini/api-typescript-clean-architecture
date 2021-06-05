import { Validation } from '../../presentation/protocols'
import { InvalidParamError } from '../../presentation/errors'

export class CompareFieldValidation implements Validation {
  constructor (
    private readonly fildName: string,
    private readonly fieldCompareName: string
  ) {}

  validate (input: any): Error | null {
    if (input[this.fildName] !== input[this.fieldCompareName]) return new InvalidParamError(this.fieldCompareName)
    return null
  }
}
