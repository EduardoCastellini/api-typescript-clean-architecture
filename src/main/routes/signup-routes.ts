import { Router } from 'express'
import { makeSingUpController } from '../factories/singup/singup'
import { adaptRoute } from '../adapters/express-route-adapter'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeSingUpController()))
}
