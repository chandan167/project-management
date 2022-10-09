import { IUser, User } from "../models/user";

export async function findByEmail(email:string){
    return User.findByEmail(email);
}

export async function findByPhone(phone:string){
    return User.findByPhone(phone);
}

export async function getUsers(){
    return User.find();
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