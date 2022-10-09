import { Request, Response, Router } from "express";

export const routes:Router = Router();

routes.get('/', (req:Request, res:Response) =>{
    return res.json({
        env:process.env
    })
})

