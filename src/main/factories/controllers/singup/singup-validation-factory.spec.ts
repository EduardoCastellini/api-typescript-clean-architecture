import { makeSingUpValidation } from './singup-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'
import { CompareFieldValidation, EmailValidation, RequeiredFieldValidation, ValidationComposite } from '../../../../validation/validators'
import { EmailValidator } from '../../../../validation/protocols/email-validator'

jest.mock('../../../../validation/validators/validation-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('singUpValidation Factory', () => {
  test('shoul call ValidationComposite with all validations', () => {
    makeSingUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequeiredFieldValidation(field))
    }

    validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))

    validations.push(new EmailValidation('email', makeEmailValidator()))

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
