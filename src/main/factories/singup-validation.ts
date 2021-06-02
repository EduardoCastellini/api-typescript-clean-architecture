import { ValidationComposit } from '../../presentation/helpers/validators/validation-composit'
import { RequeiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation-'
import { Validation } from '../../presentation/helpers/validators/validation'

export const makeSingUpValidation = (): ValidationComposit => {
  const validations: Validation[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequeiredFieldValidation(field))
  }

  return new ValidationComposit(validations)
}
