import { Router } from "express";
import { group } from "./utils/group-route";
import { asyncResolver } from "./utils/helper";

import * as UserController from './controllers/user.controller';

import { validateSchema } from "./validations/validate";
import * as UserValidation from './validations/user.validate';

export const routes:Router = Router();

routes.use('/user', group((userRoute) =>{
    userRoute.get('/', asyncResolver(UserController.getUsers));
    userRoute.post('/sign-up', validateSchema(UserValidation.SignUpSchema), asyncResolver(UserController.createUsers))
    userRoute.post('/sign-in', asyncResolver(UserController.userLogin))
}))

