import { ValidationComposite } from '../../../presentation/helpers/validators/validation-composite'
import { RequeiredFieldValidation } from '../../../presentation/helpers/validators/required-field-validation'
import { CompareFieldValidation } from '../../../presentation/helpers/validators/compare-fields-validation'
import { Validation } from '../../../presentation/protocols/validation'
import { EmailValidation } from '../../../presentation/helpers/validators/email-validation'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeSingUpValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequeiredFieldValidation(field))
  }

  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))

  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))

  return new ValidationComposite(validations)
}