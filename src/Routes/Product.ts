import { Product } from "../Models/Product";
import express, { Request, Response } from 'express';
import { checkRoleMidlewareAdmin } from "../Services/CheckRole";
import { ProductValidator } from "../Validator/ProductValidator";
import * as validator from 'express-validator';
import { ProductHasIngredient } from "../Models/ProductHasIngredient";
import { Ingredient } from "../Models/Ingredient";
import { Stock } from "../Models/Stock";
import { Company } from "../Models/Company";
import { User } from "../Models/User";
import { OrderHasProduct } from "../Models/OrderHasProduct";

let router = express.Router();


router.get('/products',  async (req: Request, res: Response) => {
    let products = await Product.find({where:{isCustom:req.query.isCustom }, relations: ["productHasIngredients", "productHasIngredients.ingredient", "productHasIngredients.ingredient.stock"]})
    
    return res.json({status:200,data:products})
})

router.post('/products', ProductValidator, async (req: Request, res: Response) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty() && req.body.ingredients) {        
        let product = new Product();
        product.name = req.body.name;
        product.price = req.body.price;
        product.isCustom = req.user.roleId !== 1;
        product.companyId = req.user.companyId;
        product.picture = req.body.picture;

        let productCreated = await product.save();

        for (let index = 0; index < req.body.ingredients.length; index++) {
            const element = req.body.ingredients[index];
            const ingredient = await Ingredient.findOne({where:{id:element.id}});
            let productHasIngredient = new ProductHasIngredient();
            productHasIngredient.product = productCreated;
            productHasIngredient.ingredient = ingredient;
            let producthasingredientCreated = await productHasIngredient.save();
        }

        const productCreatedWithIngredients = await Product.findOne({where:{id:productCreated.id}, relations: ["productHasIngredients", "productHasIngredients.ingredient", "productHasIngredients.ingredient.stock"]})

        res.json({status: 200, data: productCreatedWithIngredients});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
});

router.put('/products/:id',checkRoleMidlewareAdmin, async (req: Request, res: Response) => {

    let product = await Product.findOne({where:{id:req.params.id}});
    product.name = req.body.name;
    product.price = req.body.price;
    product.isCustom = req.body.isCustom;
    console.log(req.body.ingredients);
    
    if(req.body.ingredients){

        let newIngredients = req.body.ingredients;
        let oldIngredients = await ProductHasIngredient.find({where:{productId:product.id}});
        
        for (let index = 0; index < oldIngredients.length; index++) {
            const element = oldIngredients[index];
            if(!newIngredients.includes(element.ingredientId)){
                await element.remove();
            }
        }

        for (let index = 0; index < newIngredients.length; index++) {
            const element = newIngredients[index];
            if(!oldIngredients.map((element: ProductHasIngredient) => element.ingredientId).includes(element)){
                let productHasIngredient = new ProductHasIngredient();
                productHasIngredient.product = product;
                productHasIngredient.ingredient = element;
                let producthasingredientCreated = await productHasIngredient.save();
            }
        }
    
    }

    let productUpdated = await product.save();
    
    res.json({status: 200, data: productUpdated});
    
})

router.delete('/products/:id', checkRoleMidlewareAdmin, async (req: Request, res: Response) => {
    let productHasIngredients = await ProductHasIngredient.find({where:{productId:req.params.id}});
    for (let index = 0; index < productHasIngredients.length; index++) {
        const element = productHasIngredients[index];
        await element.remove();
    }

    let orderHasProducts = await OrderHasProduct.find({where:{productId:req.params.id}});
    for (let index = 0; index < orderHasProducts.length; index++) {
        const element = orderHasProducts[index];
        await element.remove();
    }
    let product = await Product.delete(req.params.id);
    res.json({status: 200, data: product});
})


export default router;