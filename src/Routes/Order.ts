import { Order } from "../Models/Order";
import express, { Request, Response } from 'express';
import { OrderValidator } from "../Validator/OrderValidator";
import * as validator from 'express-validator';
import { State } from "../Models/State";
import { Product } from "../Models/Product";
import { OrderHasProduct } from "../Models/OrderHasProduct";
import shortUUID from "short-uuid";
import { ProductHasIngredient } from "../Models/ProductHasIngredient";
import { Ingredient } from "../Models/Ingredient";



let router = express.Router();


router.get('/orders', async (req: Request, res: Response) => {
    let orders = await Order.find({order:{createdAt: "ASC"}, relations:["state","orderHasProducts","orderHasProducts.product","orderHasProducts.product.productHasIngredients","orderHasProducts.product.productHasIngredients.ingredient"]});
    res.json({status: 200, data: orders});
})

router.post('/orders', async (req: Request, res: Response) => {

    let state = await State.findOne(1);
    let order = new Order();
    order.createdAt = new Date();
    order.totalPrice = req.body.totPrice;
    order.state = state;
    order.user = req.user;
    order.orderNumber = shortUUID.generate();

    let orderCreated = await order.save();

    for (let index = 0; index < req.body.products.length; index++) {
        const element = req.body.products[index];
        let product = await Product.findOne({where:{id:element[0].id}});
        if (element.isCustom) {
            const productCustoms = await Product.find({relations:['productHasIngredients'], where:{isCustom:true}});
            let isAllIngredient = true;
            
            for (let index2 = 0; index2 < productCustoms.length; index2++) {
                let searchProduct = productCustoms[index2];

                const ingredientSearchProduct = await ProductHasIngredient.find({where:{productId:searchProduct.id}});
                if (ingredientSearchProduct) {   
                    if (element[1].length == ingredientSearchProduct.length) {
                        for (let index3 = 0; index3 < element[1].length; index3++) {
                            const ingredientToFind = await Ingredient.findOne({where:{id:element[1][index3].id}});
                            const ingredientSearchProduct2 = await ProductHasIngredient.findOne({where:{productId:searchProduct.id, ingredientId:ingredientToFind.id}}); 
                            console.log(ingredientSearchProduct2);
                                                         
                            if (!ingredientSearchProduct2) {
                                isAllIngredient = false;
                                break;
                            }
                        }
                        if (isAllIngredient) {                            
                            product = searchProduct;
                            break;
                        }
                    }
                }
            }
            if (element.isCustom && !isAllIngredient) {
                let productCreated = new Product();
                productCreated.name = "Custom" + " " + element[0].name;
                productCreated.price = element[0].price;
                productCreated.isCustom = true;
                productCreated.picture = "";
                productCreated.companyId = req.user.companyId;
                product = await productCreated.save();

                element[1].forEach(async (ingredient: Ingredient) => {
                    let productHasIngredient = new ProductHasIngredient();
                    productHasIngredient.product = product;
                    productHasIngredient.ingredient = ingredient;
                    let producthasingredientCreated = await productHasIngredient.save();
                });
            }
        }

        let orderHasProduct = new OrderHasProduct();
        orderHasProduct.order = orderCreated;
        orderHasProduct.product = product;
        let orderHasProductCreated = await orderHasProduct.save();
    };
    
    let result = await orderCreated.save()

    res.json({status: 200, data: result});

})

router.put('/orders/:id', async (req: Request, res: Response) => {
    let order = await Order.findOne(req.params.id);
    let state = await State.findOne(req.body.stateId);
    order.state = state;
})

router.put('/orders/:id/done', async (req: Request, res: Response) => {
    let order = await Order.findOne(req.params.id);
    order.state.id = 2
    order.save()
    
    res.json({status: 200, data: order});
})


export default router;


