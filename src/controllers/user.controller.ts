import { NextFunction, Request, RequestHandler, Response } from "express";
import { Unauthorized } from 'http-errors';
import { IUser, IUserDocument, User } from "../models/user";
import * as UserService from '../services/user.service';
import * as JwtService from '../services/jwt.service';
import { StatusCodes } from "http-status-codes";

export const getUsers: RequestHandler = async (_req: Request, res: Response, _next: NextFunction) => {
    const user = await UserService.getUsers();
    return res.apiResponse.setData({ user: user }).toJson();
}


export const signUp: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
    const { firstName, lastName, email, phone, password }: IUser = req.body;
    const user = await UserService.createUser({ firstName, lastName, email, password, phone });
    const token = JwtService.generateJwtToken({ id: user._id });
    return res.apiResponse.setData({ token: token }).setStatusCode(StatusCodes.CREATED).toJson();
}


export const userLogin: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
    const { email, password } = req.body;
    const user = await UserService.userLogin(email, password);
    if (!user) throw new Unauthorized('Wrong email and password');
    const token = JwtService.generateJwtToken({ id: user._id });
    return res.apiResponse.setData({ token: token }).toJson();
}


export const profile: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
    return res.apiResponse.setData({ user: req.auth.user }).toJson();
}


export const profileUpdate: RequestHandler = async (req: Request, res: Response, _next: NextFunction) => {
    const user = req.auth.user as IUserDocument
    const { firstName, lastName, email, phone } = req.body;
    if (email != user?.email) {
        user.emailVerifiedAt = null
    }
    if (phone != user.phone) {
        user.phoneVerifiedAt = null;
    }
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.phone = phone;
    await user.save();
    return res.apiResponse.setData({ user: user }).setMessage('Profile update successful').toJson();
}


export const userList: RequestHandler = async (req:Request, res:Response, _next:NextFunction) =>{
    const {page, limit, orderKey, orderValue, search} = req.pagination;
    const paginationData = await UserService.getUserList({page, limit, orderKey, orderValue, search}); 
    return res.apiResponse.setData({ users: paginationData }).toJson();
}


export const createUser: RequestHandler = async (req:Request, res:Response, _next:NextFunction) =>{
    const { firstName, lastName, email, phone }: IUser = req.body;
    const user = await UserService.createUser({
        firstName, lastName, email, phone,
        password: null
    });
    return res.apiResponse.setData({user:user}).setStatusCode(StatusCodes.CREATED).setMessage('User add successful').toJson();
}


export const deleteMultipleUsers: RequestHandler = async (req:Request, res:Response, _next:NextFunction) =>{
    const {ids} = req.body;
    const deleteResult = await UserService.deleteMultipleById(ids)
    return res.apiResponse.setData({ deleteResult: deleteResult }).setMessage('Users deleted successful').toJson();
}


export const userDetail: RequestHandler = async (req:Request, res:Response, _next:NextFunction) =>{
    const {id} = req.params;
    const user = await UserService.findById(id)
    return res.apiResponse.setData({ user: user }).toJson();
}