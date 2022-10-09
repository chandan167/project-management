import { Router } from "express";
import { group } from "./utils/group-route";
import { asyncResolver } from "./utils/helper";

import * as UserController from './controllers/user.controller';

export const routes:Router = Router();

routes.use('/user', group((userRoute) =>{
    userRoute.get('/', asyncResolver(UserController.getUsers));
    userRoute.post('/sign-up', asyncResolver(UserController.createUsers))
}))

