import { Order } from "../Models/Order";
import express, { Request, Response } from 'express';
import { OrderHasProduct } from "../Models/OrderHasProduct";
import { checkRoleMidlewareAdmin } from "../Services/CheckRole";




let router = express.Router();


router.get('/orderHasProduct/:id', checkRoleMidlewareAdmin,  async (req: Request, res: Response) => {
    let orderHasProducts = await OrderHasProduct.find({where:{productId: req.params.id},relations:["order"]});
    res.json({status: 200, data: orderHasProducts});
})

export default router;
