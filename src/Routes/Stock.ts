import express, { Request, Response } from 'express';
import { Stock } from '../Models/Stock';
import { checkRoleMidlewareAdmin, checkRoleMidlewareCook } from '../Services/CheckRole';
import { StockValidator } from '../Validator/StockValidator';
import * as validator from 'express-validator';



let router = express.Router();  

router.get('/stocks', async (req: Request, res: Response) => {
    let stocks = await Stock.find();
    res.json({status: 200, data: stocks});
})

router.post('/stocks', checkRoleMidlewareCook, StockValidator, async (req: Request, res: Response) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        const stock = await Stock.save(req.body);
        res.json({status: 200, data: stock});
    }else{
        res.status(400).json({ errors: errors.array() });
    }

})

router.put('/stocks/:id', StockValidator, async (req: Request, res: Response) => {
    
    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        let stock = await Stock.update(req.params.id, req.body);
        res.json({status: 200, data: stock});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.delete('/stocks/:id', checkRoleMidlewareAdmin, async (req: Request, res: Response) => {
    const stock = await Stock.delete(req.params.id);
    res.json({status: 200, data: stock});
})