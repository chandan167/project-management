import { Router } from "express";
import { group } from "./utils/group-route";
import { asyncResolver } from "./utils/helper";

import * as UserController from './controllers/user.controller';

import { validateSchema } from "./validations/validate";
import * as UserValidation from './validations/user.validate';
import { authMiddleware } from "./middlewares/auth.middlerware";
import { ProfileUpdateSchema } from "./validations/profile.validate";

export const routes:Router = Router();

routes.use('/user', group((userRoute) =>{
    // userRoute.get('/', asyncResolver(UserController.getUsers));
    userRoute.post('/sign-up', validateSchema(UserValidation.SignUpSchema), asyncResolver(UserController.createUsers))
    userRoute.post('/sign-in', validateSchema(UserValidation.SignInSchema), asyncResolver(UserController.userLogin))
    userRoute.use(authMiddleware)
    userRoute.get('/profile', asyncResolver(UserController.profile))
    userRoute.put('/profile', validateSchema(ProfileUpdateSchema), asyncResolver(UserController.profileUpdate))
    userRoute.get('/', asyncResolver(UserController.userList))
}))

