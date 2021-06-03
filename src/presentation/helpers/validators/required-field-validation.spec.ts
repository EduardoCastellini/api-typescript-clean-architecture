import { MissingParamError } from '../../errors'
import { RequeiredFieldValidation } from './required-field-validation'

describe('RequiredeField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = new RequeiredFieldValidation('field')
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = new RequeiredFieldValidation('field')
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
