import { body, ValidationChain } from 'express-validator';
import * as UserService from '../services/user.service';

export const ProfileUpdateSchema: ValidationChain[] = [
    body('firstName').notEmpty().withMessage('First Name is required').bail(),
    body('lastName').optional({nullable:true, checkFalsy:true}).notEmpty().withMessage('Last Name is required').default(null).bail(),
    body('email').notEmpty().withMessage('Email is required').bail().isEmail().normalizeEmail().withMessage('Invalid Email-Id').bail()
        .custom(async (email, {req}) => {
            const user = await UserService.findByEmailAndNotEqualById(email, req.auth.user.id)
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        }),
    body('phone').optional({ nullable: true, checkFalsy: true }).custom(async (phone, {req}) => {
        if (phone) {
            const user = await UserService.findByPhoneAndNotEqualById(phone, req.auth.user.id);
            if (user) {
                return Promise.reject('Phone number already in use');
            }
        }
    })
]