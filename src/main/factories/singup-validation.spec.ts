import { RequeiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation-'
import { Validation } from '../../presentation/helpers/validators/validation'
import { ValidationComposit } from '../../presentation/helpers/validators/validation-composit'
import { makeSingUpValidation } from './singup-validation'

jest.mock('../../presentation/helpers/validators/validation-composit')

describe('singUpValidation Factory', () => {
  test('shoul call ValidationComposite with all validations', () => {
    makeSingUpValidation()
    const validations: Validation[] = []
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequeiredFieldValidation(field))
    }
    expect(ValidationComposit).toHaveBeenCalledWith(validations)
  })
})
