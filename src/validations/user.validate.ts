import { body, param, ValidationChain } from 'express-validator';
import { Types } from 'mongoose'
import * as UserService from '../services/user.service';


export const SignUpSchema: ValidationChain[] = [
    body('firstName').notEmpty().withMessage('First Name is required').bail(),
    body('lastName').optional({ nullable: true, checkFalsy: true }).notEmpty().withMessage('Last Name is required').bail(),
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

export const CreateUserSchema: ValidationChain[] = [
    body('firstName').notEmpty().withMessage('First Name is required').bail(),
    body('lastName').optional({ nullable: true, checkFalsy: true }).notEmpty().withMessage('Last Name is required').bail(),
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
]

export const DeleteMultipleSchema: ValidationChain[] = [
    body('ids').notEmpty().withMessage('ids is required').bail().isArray().withMessage('ids must be a array of string'),
    body('ids.*').isString().withMessage('ids must be a array of string').bail().custom((value) => {
        if (Types.ObjectId.isValid(value)) return true;
        throw new Error('invalid id')
    }),
]

export const userUpdateSchema: ValidationChain[] = [
    body('firstName').notEmpty().withMessage('First Name is required').bail(),
    body('lastName').optional({ nullable: true, checkFalsy: true }).notEmpty().withMessage('Last Name is required').bail(),
    body('emailVerifiedAt').optional({ nullable: true, checkFalsy: false }).isBoolean().withMessage('Email VerifiedAt must be boolean value').bail(),
    body('phoneVerifiedAt').optional({ nullable: true, checkFalsy: false }).isBoolean().withMessage('Phone VerifiedAt must be boolean value').bail(),
    body('email').notEmpty().withMessage('Email is required').bail().isEmail().normalizeEmail().withMessage('Invalid Email-Id').bail()
        .custom(async (email, { req }) => {
            const { id } = req.params as {id:string}
            const user = await UserService.findByEmailAndNotEqualById(email, id)
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        }),
    body('phone').optional({ nullable: true, checkFalsy: true }).custom(async (phone, { req }) => {
        if (phone) {
            const { id } = req.params as {id:string}
            const user = await UserService.findByPhoneAndNotEqualById(phone, id);
            if (user) {
                return Promise.reject('Phone number already in use');
            }
        }
    })
];