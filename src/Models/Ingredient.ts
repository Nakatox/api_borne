import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany} from "typeorm";
import { ProducthasIngredient } from "./ProducthasIngredient";
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

    @OneToMany(type => ProducthasIngredient, producthasingredient => producthasingredient.ingredient)
    producthasingredients: ProducthasIngredient[];

    @OneToMany(type => Stock, stock => stock.ingredient)
    stocks: Stock[];
}