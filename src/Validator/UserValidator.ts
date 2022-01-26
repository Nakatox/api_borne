import * as validator from 'express-validator';


export const UserValidator = [
    validator.body('name').isString().isLength({min:4, max:20}),
    validator.body('password').isString().isLength({min:4, max:20}),
]