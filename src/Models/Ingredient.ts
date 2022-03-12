import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, OneToOne} from "typeorm";
import { ProductHasIngredient } from "./ProductHasIngredient";
import { Stock } from "./Stock";

@Entity()
export class Ingredient extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    isRemovable: boolean;

    @OneToMany(type => ProductHasIngredient, productHasIngredient => productHasIngredient.ingredient)
    productHasIngredients: ProductHasIngredient[];

    @OneToOne(type => Stock, stock => stock.ingredient, { onDelete: 'CASCADE' })
    stock: Stock;
}