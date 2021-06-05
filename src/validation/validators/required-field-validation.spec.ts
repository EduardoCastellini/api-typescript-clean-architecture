import { MissingParamError } from '../../presentation/errors'
import { RequeiredFieldValidation } from './required-field-validation'

const makeSut = (): RequeiredFieldValidation => {
  return new RequeiredFieldValidation('field')
}

describe('RequiredeField Validation', () => {
  test('Should return a MissingParamError if validation fails', () => {
    const sut = makeSut()
    const error = sut.validate({ name: 'any_name' })
    expect(error).toEqual(new MissingParamError('field'))
  })

  test('Should not return if validation succeeds', () => {
    const sut = makeSut()
    const error = sut.validate({ field: 'any_name' })
    expect(error).toBeFalsy()
  })
})
