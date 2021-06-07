import { HttpRequest, AddSurvey, AddSurveyModel, Validation } from './add-survey-controller-protocols'
import { AddSurveyController } from './add-survey-controller'
import { badRequest, serverError, noContent } from '../../../helpers/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }]

  }
})

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate (input: any): Error | null {
      return null
    }
  }
  return new ValidationStub()
}

const makeAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add (data: AddSurveyModel): Promise<void> {
      return await new Promise(resolve => resolve())
    }
  }
  return new AddSurveyStub()
}

interface sutTypes {
  sut: AddSurveyController
  validationStub: Validation
  addSurveystub: AddSurvey
}

const makeSut = (): sutTypes => {
  const validationStub = makeValidation()
  const addSurveystub = makeAddSurvey()
  const sut = new AddSurveyController(validationStub, addSurveystub)

  return {
    sut,
    validationStub,
    addSurveystub
  }
}

describe('AddSurvey Controller', () => {
  test('Shoud call validation with correct values', async () => {
    const { sut, validationStub } = makeSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation fails ', async () => {
    const { sut, validationStub } = makeSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new Error()))
  })

  test('Should call AddSurvey with correct values ', async () => {
    const { sut, addSurveystub } = makeSut()
    const addspy = jest.spyOn(addSurveystub, 'add')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addspy).toHaveBeenLastCalledWith(httpRequest.body)
  })

  test('Should return 500 if AddSurvey throws', async () => {
    const { sut, addSurveystub } = makeSut()
    jest.spyOn(addSurveystub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())))
    const httpResponde = await sut.handle(makeFakeRequest())
    expect(httpResponde).toEqual(serverError(new Error()))
  })

  test('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponde = await sut.handle(makeFakeRequest())
    expect(httpResponde).toEqual(noContent())
  })
})
