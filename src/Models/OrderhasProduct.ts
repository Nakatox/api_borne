import {Entity, PrimaryGeneratedColumn, BaseEntity, ManyToOne, Column, JoinColumn} from "typeorm";
import {Product} from "./Product";
import {Order} from "./Order";

@Entity()
export class OrderHasProduct extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "productid"})
    productId: number;

    @Column({name: "orderid"})
    orderId: number;

    @ManyToOne(type => Order, order => order.orderHasProducts)
    @JoinColumn({name: "orderid"})
    order: Order;

    @ManyToOne(type => Product, product => product.orderHasProducts)
    @JoinColumn({name: "productid"})
    product: Product;
}