import * as validator from 'express-validator';

export const ProductValidator = [
    validator.body('name').isString().isLength({min:4, max:20}),
    validator.body('price').isNumeric().isLength({min:1, max:10}),
    validator.body('isCustom').isBoolean(),
]