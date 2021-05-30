import { Express } from 'express'
import { bodyParses, contentType, cors } from '../middlewares'

export default (app: Express): void => {
  app.use(contentType)
  app.use(bodyParses)
  app.use(cors)
}
