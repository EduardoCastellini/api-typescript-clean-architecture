import { ValidationComposit } from '../../presentation/helpers/validators/validation-composit'
import { RequeiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation-'
import { CompareFieldValidation } from '../../presentation/helpers/validators/compare-fields-validation'
import { Validation } from '../../presentation/helpers/validators/validation'

export const makeSingUpValidation = (): ValidationComposit => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequeiredFieldValidation(field))
  }
  validations.push(new CompareFieldValidation('password', 'passwordConfirmation'))
  return new ValidationComposit(validations)
}
