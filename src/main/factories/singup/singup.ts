import { SignUpController } from '../../../presentation/controllers/singup/signup'
import { DbAddAccount } from '../../../data/usescases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/cryptography/bcrypter-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../../infra/db/mongodb/log-repository/log'
import { LogControllerDecotator } from '../../decorators/log'
import { makeSingUpValidation } from './singup-validation'
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
