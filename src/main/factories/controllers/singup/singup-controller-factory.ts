import { SignUpController } from '../../../../presentation/controllers/singup/signup-controller'
import { Controller } from '../../../../presentation/protocols'
import { makeSingUpValidation } from './singup-validation-factory'
import { makeDbAuthentication } from '../../usecases/authentication/db-authentication-factory'
import { makeDbAddAccount } from '../../usecases/add-account/db-add-account-factory'
import { makeLogControllerDecorator } from '../../decorators/log-controller-decorator-factory'

export const makeSingUpController = (): Controller => {
  const controller = new SignUpController(makeDbAddAccount(), makeSingUpValidation(), makeDbAuthentication())
  return makeLogControllerDecorator(controller)
}
