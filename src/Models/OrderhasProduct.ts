import {Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne} from "typeorm";
import {Product} from "./Product";
import {Order} from "./Order";

@Entity()
export class OrderhasProduct extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Order, order => order.orderhasproducts)
    order: Order;

    @ManyToOne(type => Product, product => product.orderhasproducts)
    product: Product;
}