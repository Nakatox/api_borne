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
    updateStock = async () => {
        let updatedInrgedient = await Ingredient.findOne(this.ingredientId, {relations: ["stock"]});
        
        global.io.emit('stockUpdate', {
            id: this.id,
            ingredient: updatedInrgedient,
            quantity: this.quantity
        });     
        if (this.quantity < 5) {
            global.io.emit('lowStock', {
                id: this.id,
                ingredient: updatedInrgedient,
            });
            transport.sendMail({
                from: "server@gmail.com",
                to: "admin@gmail.com",
                subject: "Low stock",
                text: "The stock of ingredient " + updatedInrgedient.name + " is low, please restock it"
            });
        }
    }
}