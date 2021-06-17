import { DbAddSurvey } from '../../../../../data/usescases/add-survey/add-survey'
import { SurveyMongoRepository } from '../../../../../infra/db/mongodb/survey/survey-mongo-repository'
import { AddSurvey } from '../../../../../domain/usecases/add-survey.ts'

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository()
  return new DbAddSurvey(surveyMongoRepository)
}
