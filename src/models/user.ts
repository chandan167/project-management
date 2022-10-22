
import { Document, Schema, model, Model, Types, FilterQuery } from 'mongoose';
import bcrypt from 'bcryptjs';
import { environment } from '../config/environment';
import { PaginationDataI, PaginationI } from '../interfaces/paginationI';

export interface IUser {
    firstName: string;
    lastName?: string;
    fullName?: string | null
    email: string;
    emailVerifiedAt?: Date | null
    phone?: string;
    phoneVerifiedAt?: Date | null
    avatar?: string;
    password: string;
    isSuperAdmin?: boolean;
}

export interface IUserDocument extends IUser, Document {
    comparePassword(password: string): Promise<Boolean>;
    isEmailVerified(): Boolean;
    isPhoneVerified(): Boolean;
}

export type UserOrderKeyType = 'firstName' | 'lastName' | 'email' | 'phone' | 'createdAt';



interface IUserModel extends Model<IUserDocument> {
    findByEmail(email: string): Promise<IUserDocument | null>;
    findByPhone(phone: string): Promise<IUserDocument | null>;
    findByPk(id: string): Promise<IUserDocument | null>;
    findByEmailAndNotEqualById(email:string, id:string): Promise<IUserDocument | null>;
    findByPhoneAndNotEqualById(phone:string, id:string): Promise<IUserDocument | null>;
    pagination(options: PaginationI<UserOrderKeyType>): Promise<PaginationDataI<IUserDocument>>
}

const userSchema = new Schema<IUserDocument>({
    firstName: { type: String, required: true },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    emailVerifiedAt: { type: Date, default: null },
    phone: { type: String, default: null, index: true },
    phoneVerifiedAt: { type: Date, default: null },
    avatar: { type: String, default: null },
    password: { type: String, required: true },
    isSuperAdmin: {type:Boolean, default: false},
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(_doc: any, ret: any, _options: any) {
            ret.id = ret._id;
            delete ret.password,
                delete ret.__v;
            return ret;
        }
    }
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(environment.password_salt)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

userSchema.virtual('fullName').get(function () {
    return `${this.firstName || ''} ${this.lastName || ''}`.trim();
});

userSchema.method('comparePassword', async function (password: string): Promise<Boolean> {
    return await bcrypt.compare(password, this.password)
})

userSchema.method('isEmailVerified', function (): Boolean {
    return !!this.emailVerifiedAt;
})

userSchema.method('isPhoneVerified', function (): Boolean {
    return !!this.phoneVerifiedAt;
})

userSchema.static('findByEmail', async function (email: string): Promise<IUserDocument | null> {
    return this.findOne({ email: email })
})

userSchema.static('findByPhone', async function (phone: string): Promise<IUserDocument | null> {
    return this.findOne({ phone: phone })
})

userSchema.static('findByPk', async function (id: string): Promise<IUserDocument | null> {
    const _id = new Types.ObjectId(id)
    return this.findById(_id)
})

userSchema.static('findByEmailAndNotEqualById', async function (email:string, id: string): Promise<IUserDocument | null> {
    const _id = new Types.ObjectId(id)
    return this.findOne({
        email:email,
        _id: {"$ne": _id}
    })
})

userSchema.static('findByPhoneAndNotEqualById', async function (phone:string, id: string): Promise<IUserDocument | null> {
    const _id = new Types.ObjectId(id)
    return this.findOne({
        phone:phone,
        _id: {"$ne": _id}
    })
})

userSchema.static('pagination', async function (options: PaginationI<UserOrderKeyType>): Promise<PaginationDataI<IUserDocument>> {
    let filter:FilterQuery<IUserDocument> = {};
    const page = Number(options.page);
    const limit = Number(options.limit);
    const offSet = ((page -1) * limit);
    const search = options.search
    console.log(options)
    if(options.search){
        filter = {
            "$or": [
                {
                    firstName: {
                        "$regex": search,
                        "$options": 'i'
                    }
                },
                {
                    lastName: {
                        "$regex": search,
                        "$options": 'i'
                    }
                },
                {
                    email: {
                        "$regex": search,
                        "$options": 'i'
                    }
                },
                {
                    phone: {
                        "$regex": search,
                        "$options": 'i'
                    }
                },
            ]
        }
    }
    const [count, users] = await Promise.all([
        this.count(filter),
        this.find(filter).limit(limit).skip(offSet).sort([[options.orderKey, Number(options.orderValue)]]),
    ]) ;
    const allPages = Math.ceil(count / limit)
    let nextPage:number | null = page + 1;
    if(allPages <= page){
        nextPage = null;
    }
    let previousPage = null;
    if(page> 1){
        previousPage = page -1;
    }
   return {
    search: search,
    count:users.length,
    nextPage: nextPage,
    previousPage: previousPage,
    currentPage: page,
    total: count,
    limit: limit,
    record: users
   }
})


export const User = model<IUserDocument, IUserModel>('User', userSchema);