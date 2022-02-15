import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn} from "typeorm";
import {Product} from "./Product";
import {Ingredient} from "./Ingredient";

@Entity()
export class ProductHasIngredient extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "productid"})
    productId: number;

    @Column({name: "ingredientid"})
    ingredientId: number;

    @ManyToOne(type => Product, product => product.productHasIngredients)
    @JoinColumn({name: "productid"})
    product: Product;

    @ManyToOne(type => Ingredient, ingredient => ingredient.productHasIngredients)
    @JoinColumn({name: "ingredientid"})
    ingredient: Ingredient;

}