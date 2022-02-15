import { Company } from "../Models/Company";
import express, { Request, Response } from 'express';
import { checkRoleMidlewareAdmin } from "../Services/CheckRole";
import { CompagnyValidator } from "../Validator/CompagnyValidator";
import * as validator from 'express-validator';



let router = express.Router();

router.post('/company', CompagnyValidator, (req: Request, res: Response) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        Company.save(req.body).then(company => {
            res.json({status: 200, data: company});
        }).catch(err => {
            res.json({status: 500, data: err});
        })
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})


export default router;