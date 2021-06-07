import { AddSurveyModel } from '../../../../domain/usecases/add-survey.ts'

export interface AddSurveyRepository {
  add: (surveydata: AddSurveyModel) => Promise<void>
}
