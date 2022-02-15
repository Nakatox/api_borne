import * as validator from 'express-validator';


export const OrderValidator = [
    validator.body('createdAt').isDate(),
    validator.body('totalPrice').isNumeric(),
    

]