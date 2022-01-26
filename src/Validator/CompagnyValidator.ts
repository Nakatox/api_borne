import * as validator from 'express-validator';

export const CompagnyValidator = [
    validator.body('name').isString().isLength({min:4, max:50})
]