import { NextFunction, Request, RequestHandler, Response } from "express";
import { Unauthorized } from 'http-errors';
import { IUser } from "../models/user";
import * as UserService from '../services/user.service';
import * as JwtService from '../services/jwt.service';
import { apiResponse } from "../utils/api-response";
import { StatusCodes } from "http-status-codes";

export const getUsers: RequestHandler = async (_req:Request, _res: Response, _next:NextFunction) =>{
    const user = await UserService.getUsers();
    return apiResponse().setData({user:user}).toJson();
}


export const createUsers: RequestHandler = async (req:Request, _res: Response, _next:NextFunction) =>{
    const {firstName, lastName, email, phone, password}:IUser = req.body;
    const user = await UserService.createUser({firstName, lastName, email, password, phone});
    const token = JwtService.generateJwtToken({id: user._id});
    return apiResponse().setData({token:token}).setStatusCode(StatusCodes.CREATED).toJson();
}

export const userLogin: RequestHandler = async (req:Request, _res:Response, _next:NextFunction) =>{
    const {email, password} = req.body;
    const user = await UserService.userLogin(email, password);
    if(!user) throw new Unauthorized('Wrong email and password');
    const token = JwtService.generateJwtToken({id: user._id});
    return apiResponse().setData({token:token}).toJson();
}