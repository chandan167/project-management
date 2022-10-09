import { Router } from "express"

export const group = (fun: (router:Router) => void):Router =>{
    const router = Router();
    fun(router);
    return router;
}