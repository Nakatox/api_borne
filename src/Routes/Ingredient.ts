import express, { Request, Response } from 'express';
import { checkRoleMidlewareAdmin } from "../Services/CheckRole";
import { ProductValidator } from "../Validator/ProductValidator";
import * as validator from 'express-validator';
import { ProductHasIngredient } from "../Models/ProductHasIngredient";
import { Ingredient } from "../Models/Ingredient";
import { Stock } from '../Models/Stock';

let router = express.Router();


router.get('/ingredients',  async (req: Request, res: Response) => {
    let ingredients = await Ingredient.find({relations: ["stock"]});
    return res.json({status:200,data:ingredients});
})

router.post('/ingredients',  async (req: Request, res: Response) => {

    let ingredient = new Ingredient();
    ingredient.name = req.body.name;
    ingredient.price = req.body.price;
    ingredient.isRemovable = req.body.isRemovable;
    await ingredient.save();

    let stock = new Stock();
    stock.companyId = req.user.companyId;
    stock.ingredientId = ingredient.id;
    stock.quantity = req.body.stock;
    await stock.save();

    let ingredientCreated = await Ingredient.findOne({where: {id: ingredient.id}, relations: ["stock"]});

    return res.json({status:200,data:ingredientCreated});
})

router.put('/ingredients/:id',checkRoleMidlewareAdmin, async (req: Request, res: Response) => {

    let ingredient = await Ingredient.findOne({where:{id:req.params.id}});
    ingredient.name = req.body.name;
    ingredient.price = req.body.price;
    ingredient.isRemovable = req.body.isRemovable;
    let stock = await Stock.findOne({where:{ingredientId:ingredient.id}});
    stock.quantity = req.body.stock;
    
    stock.save();

    let ingredientUp = await ingredient.save();
    let ingredientUpdated = await Ingredient.findOne({where:{id:ingredientUp.id}, relations: ["stock"]});


    return res.json({status:200,data:ingredientUpdated});
})

router.delete('/ingredients/:id',checkRoleMidlewareAdmin, async (req: Request, res: Response) => {

    let ingredient = await Ingredient.findOne({where:{id:req.params.id}});
    let stock = await Stock.findOne({where:{ingredientId:req.params.id}});
    await stock.remove();

    let productHasIngredients = await ProductHasIngredient.find({where:{ingredientId:req.params.id}});
    for (let index = 0; index < productHasIngredients.length; index++) {
        const element = productHasIngredients[index];
        await element.remove();
    }

    let ingredientDeleted = await ingredient.remove();

    return res.json({status:200,data:ingredientDeleted});
})

export default router;