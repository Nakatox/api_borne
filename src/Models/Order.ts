import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany, ManyToOne} from "typeorm";
import { OrderhasProduct } from "./OrderhasProduct";
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

    @OneToMany(type => OrderhasProduct, orderhasproduct => orderhasproduct.order)
    orderhasproducts: OrderhasProduct[];

    @ManyToOne(type => State, state => state.orders)
    state: State;

    @ManyToOne(type => User, user => user.orders)
    user: User;
}