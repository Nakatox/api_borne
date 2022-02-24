import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne} from "typeorm";
import { OrderHasProduct } from "./OrderHasProduct";
import { State } from "./State";
import { User } from "./User";

@Entity()
export class Order extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    createdAt: Date;

    @Column()
    totalPrice: number;

    @Column()
    orderNumber: string;

    @OneToMany(type => OrderHasProduct, orderHasProduct => orderHasProduct.order)
    orderHasProducts: OrderHasProduct[];

    @ManyToOne(type => State, state => state.orders)
    state: State;

    @ManyToOne(type => User, user => user.orders)
    user: User;
}