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
import { Stock } from "../Models/Stock";
import { transport } from "../email";



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
    order.orderNumber = shortUUID.generate().substring(0, 4).toLowerCase();

    let orderCreated = await order.save();
    
    for (let index = 0; index < req.body.products.length; index++) {
        const element = req.body.products[index];
        let product = await Product.findOne({where:{id:element[0].id},relations:['productHasIngredients']});
        let isCustom = (element[2] != product.price || element[1].length != product.productHasIngredients.length);
        
        if (isCustom) {
            
            const productCustoms = await Product.find({relations:['productHasIngredients'], where:{isCustom:true}});
            
            let isAllIngredient = true;
            for (let index2 = 0; index2 < productCustoms.length; index2++) {
                isAllIngredient = true;
                let searchProduct = productCustoms[index2];

                const ingredientSearchProduct = await ProductHasIngredient.find({where:{productId:searchProduct.id}});
                if (ingredientSearchProduct) {   
                    
                    if (element[1].length == ingredientSearchProduct.length) {
                        for (let index3 = 0; index3 < element[1].length; index3++) {
                            const ingredientToFind = await Ingredient.findOne({where:{id:element[1][index3].id}});
                            const ingredientSearchProduct2 = await ProductHasIngredient.findOne({where:{productId:searchProduct.id, ingredientId:ingredientToFind.id}}); 
                                                                                     
                            if (!ingredientSearchProduct2) {
                                isAllIngredient = false;
                            }
                        }
                        
                        if (isAllIngredient) {          
                            product = searchProduct;
                            break;
                        }
                    } else {
                        isAllIngredient = false;
                    }
                }
            }
            
            if (isCustom && !isAllIngredient) {
                let productCreated = new Product();
                productCreated.name = "Custom" + " " + element[0].name;
                productCreated.price = element[0].price;
                productCreated.isCustom = true;
                productCreated.picture = "";0
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
        let productHasIngredients = await ProductHasIngredient.find({where:{productId:product.id}});
        for (let index = 0; index < productHasIngredients.length; index++) {
            const element = productHasIngredients[index];
            let stock = await Stock.findOne({where:{ingredientId:element.ingredientId}});
            stock.quantity -= 1;
            await stock.save();
        }
        let orderHasProductCreated = await orderHasProduct.save();
    };
    
    let result = await orderCreated.save()
    let orderResult = await Order.findOne({where:{id:result.id},relations:["state","orderHasProducts","orderHasProducts.product","orderHasProducts.product.productHasIngredients","orderHasProducts.product.productHasIngredients.ingredient"]});

    req.io.emit('newOrder', {
        order: orderResult
    });
    const regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (req.body.userEmail != "" && req.body.userEmail != null && regexEmail.test(req.body.userEmail)) {
        const htmlOrder = `
            <h1>Recap of yourt order</h1>
            <p>Order number: ${orderResult.orderNumber}</p>
            <p>Total price: ${orderResult.totalPrice}</p>
            <p>Products:</p>
            <ul>
                ${orderResult.orderHasProducts.map(product => 
                    `<li>
                        ${product.product.name}
                        <ul>
                            ${product.product.productHasIngredients.map(ingredient =>
                                `<li>${ingredient.ingredient.name}</li>`
                            ).join('')}
                        </ul>
                    </li>
                `).join('')}
            </ul>
            `;
        transport.sendMail({
            from: "server@gmail.com",
            to: req.body.userEmail,
            subject: "Low stock",
            text: htmlOrder
        });
    }

    res.json({status: 200, data: result});

})

router.get('/orders/:id', async (req: Request, res: Response) => {
    let order = await Order.findOne(req.params.id);
    let state = await State.findOne({where:{name:"done"}});
    order.state = state;
    order.save()
    
    res.json({status: 200, data: order});
})

router.put('/orders/:id/done', async (req: Request, res: Response) => {
    let order = await Order.findOne(req.params.id);
    let state = await State.findOne({where:{name:"done"}});
    order.state = state;
    order.save()
    
    res.json({status: 200, data: order});
})


export default router;


