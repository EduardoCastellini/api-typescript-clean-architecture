import { SignUpController } from '../../../presentation/controllers/singup/signup-controller'
import { DbAddAccount } from '../../../data/usescases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { LogControllerDecotator } from '../../decorators/log-controller-decorator'
import { makeSingUpValidation } from './singup-validation-factory'
import { Controller } from '../../../presentation/protocols'

export const makeSingUpController = (): Controller => {
  const salt = 12
  const bcryptAdapter = new BcryptAdapter(salt)
  const accountMongoRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository)
  const singUpController = new SignUpController(dbAddAccount, makeSingUpValidation())
  const logMongoRepository = new LogMongoRepository()
  return new LogControllerDecotator(singUpController, logMongoRepository)
}
