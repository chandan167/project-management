import { body, ValidationChain } from 'express-validator';
import * as UserService from '../services/user.service';

export const SignUpSchema: ValidationChain[] = [
    body('firstName').notEmpty().withMessage('First Name is required').bail(),
    body('lastName').optional({nullable:true, checkFalsy:true}).notEmpty().withMessage('Last Name is required').bail(),
    body('email').notEmpty().withMessage('Email is required').bail().isEmail().normalizeEmail().withMessage('Invalid Email-Id').bail()
        .custom(async email => {
            const user = await UserService.findByEmail(email)
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        }),
    body('phone').optional({ nullable: true, checkFalsy: true }).custom(async phone => {
        if (phone) {
            const user = await UserService.findByPhone(phone);
            if (user) {
                return Promise.reject('Phone number already in use');
            }
        }
    }),
    body('password').notEmpty().withMessage('Password is required').bail(),
    body('confirmPassword').notEmpty().withMessage('Confirm Password is required').bail().custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation is incorrect');
        }
        return true
    })
]

export const SignInSchema: ValidationChain[] = [
    body('email').notEmpty().withMessage('Email is required').bail().isEmail().normalizeEmail().withMessage('Invalid Email-Id').bail(),
    body('password').notEmpty().withMessage('Password is required').bail(),
] 