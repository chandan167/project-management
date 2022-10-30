import mongoose from "mongoose"
import { UnprocessableEntity } from 'http-errors';

export const checkMongooseId = (id:string) =>{
    if(mongoose.isValidObjectId(id)){
        return true;
    }
    throw new UnprocessableEntity(`Invalid user id : ${id}`)
}