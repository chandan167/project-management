
import { Document, Schema, model, Model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { environment } from '../config/environment';

export interface IUser {
    firstName: string;
    lastName?: string;
    email: string;
    emailVerifiedAt?: Date
    phone?: string;
    phoneVerifiedAt?: Date
    avatar?: string;
    password: string
}

export interface IUserDocument extends IUser, Document {
    comparePassword(password: string): Promise<Boolean>;
    isEmailVerified(): Boolean;
    isPhoneVerified(): Boolean;
}

interface IUserModel extends Model<IUserDocument> {
    findByEmail(email: string): Promise<IUserDocument | null>
    findByPhone(phone: string): Promise<IUserDocument | null>
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
}, {
    timestamps: true,
    toJSON: {
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


export const User = model<IUserDocument, IUserModel>('User', userSchema);