import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne} from "typeorm";
import { Company } from "./Company";
import { OrderhasProduct } from "./OrderhasProduct";
import { ProducthasIngredient } from "./ProducthasIngredient";
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

    @OneToMany(type => OrderhasProduct, orderhasproduct => orderhasproduct.product)
    orderhasproducts: OrderhasProduct[];

    @OneToMany(type => ProducthasIngredient, producthasingredient => producthasingredient.product)
    producthasingredients: ProducthasIngredient[];

    @ManyToOne(type => Company , company => company.products)
    company: Company;

    @ManyToOne(type => Product, product => product.products)
    products: Product[];


}