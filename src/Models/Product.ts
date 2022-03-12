import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne, JoinColumn} from "typeorm";
import { Company } from "./Company";
import { OrderHasProduct } from "./OrderHasProduct";
import { ProductHasIngredient } from "./ProductHasIngredient";
@Entity()
export class Product extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    price: number;

    @Column()
    isCustom: boolean;

    @Column()
    picture: string;

    @Column({name: "companyid"})
    companyId: number;

    @OneToMany(type => OrderHasProduct, orderHasProduct => orderHasProduct.product, { onDelete: 'CASCADE' })
    orderHasProducts: OrderHasProduct[];

    @OneToMany(type => ProductHasIngredient, productHasIngredient => productHasIngredient.product, { onDelete: 'CASCADE' })
    productHasIngredients: ProductHasIngredient[];

    @ManyToOne(type => Company , company => company.products)
    @JoinColumn({name: "companyid"})
    company: Company;
}