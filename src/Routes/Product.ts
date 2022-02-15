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

let router = express.Router();


router.get('/products',  async (req: Request, res: Response) => {
    let products = await Product.find({where:{isCustom:req.query.isCustom }, relations: ["productHasIngredients", "productHasIngredients.ingredient", "productHasIngredients.ingredient.stock"]})
    
    return res.json({status:200,data:products})
})

router.post('/products',checkRoleMidlewareAdmin, ProductValidator, async (req: Request, res: Response) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty() && req.body.ingredients) {        
        let product = new Product();
        product.name = req.body.name;
        product.price = req.body.price;
        product.isCustom = req.body.isCustom;
        product.companyId = req.user.companyId;

        let productCreated = await product.save();

        req.body.ingredients.forEach(async (element: number) => {
            const ingredient = await Ingredient.findOne({where:{id:element}});
            let productHasIngredient = new ProductHasIngredient();
            productHasIngredient.product = productCreated;
            productHasIngredient.ingredient = ingredient;
            let producthasingredientCreated = await productHasIngredient.save();
        });

        res.json({status: 200, data: product});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
});

router.put('/products/:id',checkRoleMidlewareAdmin, ProductValidator, async (req: Request, res: Response) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        let product = await Product.update(req.params.id, req.body);
        res.json({status: 200, data: product});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.delete('/products/:id', checkRoleMidlewareAdmin, async (req: Request, res: Response) => {
    let product = await Product.delete(req.params.id);
    res.json({status: 200, data: product});
})


export default router;