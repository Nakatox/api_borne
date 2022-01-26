import { Product } from "../Models/Product";
import express from 'express';
import { checkRoleMidlewareAdmin } from "../Services/CheckRole";
import { ProductValidator } from "../Validator/ProductValidator";
import * as validator from 'express-validator';

let router = express.Router();

router.get('/products', async (req, res) => {
    let products = await Product.find({where:{isCustom:req.query.isCustom }});
    res.json({status: 200, data: products});
})

router.post('/products',checkRoleMidlewareAdmin, ProductValidator, async (req, res) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        let product = await Product.save(req.body);
        res.json({status: 200, data: product});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
});

router.put('/products/:id',checkRoleMidlewareAdmin, ProductValidator, async (req, res) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        let product = await Product.update(req.params.id, req.body);
        res.json({status: 200, data: product});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.delete('/products/:id', checkRoleMidlewareAdmin, async (req, res) => {
    let product = await Product.delete(req.params.id);
    res.json({status: 200, data: product});
})


export default router;