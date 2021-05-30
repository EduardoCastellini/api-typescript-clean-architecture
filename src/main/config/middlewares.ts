import { Express } from 'express'
import { bodyParses } from '../middlewares/body-parser'

export default (app: Express): void => {
  app.use(bodyParses)
}
