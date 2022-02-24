import express, { Request, Response } from 'express';
import { checkRoleMidlewareAdmin } from "../Services/CheckRole";
import { ProductValidator } from "../Validator/ProductValidator";
import * as validator from 'express-validator';
import { ProductHasIngredient } from "../Models/ProductHasIngredient";
import { Ingredient } from "../Models/Ingredient";

let router = express.Router();


router.get('/ingredients',  async (req: Request, res: Response) => {
    let ingredients = await Ingredient.find({relations: ["stock"]});
    return res.json({status:200,data:ingredients});
})

export default router;