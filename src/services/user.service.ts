import { PaginationI } from "../interfaces/paginationI";
import { IUser, User, UserOrderKeyType } from "../models/user";

export async function findByEmail(email:string){
    return User.findByEmail(email);
}

export async function findByPhone(phone:string){
    return User.findByPhone(phone);
}

export async function findByEmailAndNotEqualById(email: string, id:string){
    return User.findByEmailAndNotEqualById(email, id);
}

export async function findByPhoneAndNotEqualById(phone: string, id:string){
    return User.findByPhoneAndNotEqualById(phone, id);
}

export async function getUsers(){
    return User.find();
}

export async function findById(id:string) {
    return User.findByPk(id);
}

export async function createUser(user: IUser){
    return await User.create(user);
}

export async function userLogin(email:string, password:string){
    const user = await findByEmail(email);
    if(user && await user.comparePassword(password)){
        return user;
    }
    return null;
}

export async function getUserList(option: PaginationI<UserOrderKeyType>){
    return User.pagination(option)
}
