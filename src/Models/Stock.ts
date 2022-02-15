import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, OneToOne} from "typeorm";
import { Company } from "./Company";
import { Ingredient } from "./Ingredient";

@Entity()
export class Stock extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    quantity: number;

    @Column({name: "companyid"})
    companyId: number;

    @Column({name: "ingredientid"})
    ingredientId: number;

    @ManyToOne(type => Company, company => company.stocks)
    @JoinColumn({name: "companyid"})
    company: Company;

    @OneToOne(type => Ingredient, ingredient => ingredient.stock)
    @JoinColumn({name: "ingredientid"})
    ingredient: Ingredient;

}