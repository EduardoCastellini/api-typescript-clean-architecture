import { Express } from 'express'
import { bodyParses } from '../middlewares/body-parser'
import { cors } from '../middlewares/cors'
import { contentType } from '../middlewares/content-type'

export default (app: Express): void => {
  app.use(contentType)
  app.use(bodyParses)
  app.use(cors)
}
