import {Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import {Product} from "./Product";
import {Order} from "./Order";

@Entity()
export class OrderHasProduct extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Order, order => order.orderHasProducts)
    order: Order;

    @ManyToOne(type => Product, product => product.orderHasProducts)
    product: Product;
}