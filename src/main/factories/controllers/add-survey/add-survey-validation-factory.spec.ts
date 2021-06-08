import { ValidationComposite, RequeiredFieldValidation } from '../../../../validation/validators'
import { makeAddSurveyValidation } from './add-survey-validation-factory'
import { Validation } from '../../../../presentation/protocols/validation'

jest.mock('../../../../validation/validators/validation-composite')

describe('AddSurveyValidation Factory', () => {
  test('shoul call ValidationComposite with all validations', () => {
    makeAddSurveyValidation()
    const validations: Validation[] = []
    for (const field of ['question', 'answers']) {
      validations.push(new RequeiredFieldValidation(field))
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations)
  })
})
