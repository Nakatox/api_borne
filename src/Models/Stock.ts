import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import { Company } from "./Company";
import { Ingredient } from "./Ingredient";

@Entity()
export class Stock extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @ManyToOne(type => Company, company => company.stocks)
    company: Company;

    @ManyToOne(type => Ingredient, ingredient => ingredient.stocks)
    ingredient: Ingredient;

}