import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, JoinColumn, OneToOne, AfterUpdate} from "typeorm";
import { Company } from "./Company";
import { Ingredient } from "./Ingredient";
import { transport } from "../email";

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

    @AfterUpdate()
    updateStock() {
        global.io.emit('stockUpdate', {
            id: this.id,
            ingredient: this.ingredientId,
            quantity: this.quantity
        });     
        if (this.quantity < 5) {
            transport.sendMail({
                from: "server@gmail.com",
                to: "admin@gmail.com",
                subject: "Low stock",
                text: "The stock of ingredient " + this.ingredientId + " is low, please restock it"
            });
        }
    }
}