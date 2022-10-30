import { v4 as uuidv4 } from 'uuid';
import { PaginationI } from "../interfaces/paginationI";
import { IUser, IUserDocument, User, UserOrderKeyType } from "../models/user";
import * as BaseService from './base.service';

export async function findByEmail(email: string) {
    return User.findByEmail(email);
}

export async function findByPhone(phone: string) {
    return User.findByPhone(phone);
}

export async function findByEmailAndNotEqualById(email: string, id: string) {
    
    try{
        BaseService.checkMongooseId(id)
    }catch (error: Error | any) {
        throw error
    }
    return User.findByEmailAndNotEqualById(email, id);
}

export async function findByPhoneAndNotEqualById(phone: string, id: string) {
    try{
        BaseService.checkMongooseId(id)
    }catch (error: Error | any) {
        throw error
    }
    return User.findByPhoneAndNotEqualById(phone, id);
}

export async function getUsers() {
    return User.find();
}

export async function findById(id: string) {
    try{
        BaseService.checkMongooseId(id)
    }catch (error: Error | any) {
        throw error
    }
    return await User.findByPk(id);

}

export async function createUser(user: IUser) {
    if (!user.password) user.password = uuidv4();
    return await User.create(user);
}

export async function userLogin(email: string, password: string) {
    const user = await findByEmail(email);
    if (user && await user.comparePassword(password)) {
        return user;
    }
    return null;
}

export async function getUserList(option: PaginationI<UserOrderKeyType>) {
    return User.pagination(option)
}

export async function deleteMultipleById(ids: Array<string>) {
    return User.deleteManyById(ids)
}

export async function updateUser(user: IUserDocument, userData: IUser) {
    user.makeEmailVerified(userData?.emailVerifiedAt as Boolean|null)
    user.makePhoneVerified(userData?.phoneVerifiedAt as Boolean|null)
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.phone = userData.phone;
    await user.save();
    return user
}
