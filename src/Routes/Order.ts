import { Order } from "../Models/Order";
import express, { Request, Response } from 'express';
import { OrderValidator } from "../Validator/OrderValidator";
import * as validator from 'express-validator';
import { State } from "../Models/State";
import { Product } from "../Models/Product";
import { OrderHasProduct } from "../Models/OrderHasProduct";



let router = express.Router();


router.get('/orders', async (req: Request, res: Response) => {
    let orders = await Order.find({relations:["orderHasProducts","orderHasProducts.product"]});
    res.json({status: 200, data: orders});
})

router.post('/orders', async (req: Request, res: Response) => {
    
    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        let state = await State.findOne(1);
        let totPrice = 0;
        let order = new Order();
        order.createdAt = new Date();
        order.totalPrice = totPrice;
        order.state = state;
        order.user = req.user;

        let orderCreated = await order.save();

        for (let index = 0; index < req.body.products.length; index++) {
            const element = req.body.products[index];
            const product = await Product.findOne({where:{id:element}});
            totPrice+=product.price;
            let orderHasProduct = new OrderHasProduct();
            orderHasProduct.order = orderCreated;
            orderHasProduct.product = product;
            let orderHasProductCreated = await orderHasProduct.save();
        };
        
        orderCreated.totalPrice = totPrice
        let result = await orderCreated.save()

        res.json({status: 200, data: result});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.put('/orders/:id', async (req: Request, res: Response) => {
    let order = await Order.findOne(req.params.id);
    let state = await State.findOne(req.body.stateId);
    order.state = state;
})


export default router;


