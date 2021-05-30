import { Express } from 'express'
import { bodyParses } from '../middlewares/body-parser'
import { cors } from '../middlewares/cors'

export default (app: Express): void => {
  app.use(bodyParses)
  app.use(cors)
}
