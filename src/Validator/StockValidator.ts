import * as validator from 'express-validator';


export const StockValidator = [
    validator.body('name').isString().isLength({min:4, max:20}),
    validator.body('quantity').isNumeric().isLength({min:1, max:99999})
]