import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import {Product} from "./Product";
import {Ingredient} from "./Ingredient";

@Entity()
export class ProducthasIngredient extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Product, product => product.producthasingredients)
    product: Product;

    @ManyToOne(type => Ingredient, ingredient => ingredient.producthasingredients)
    ingredient: Ingredient;

}