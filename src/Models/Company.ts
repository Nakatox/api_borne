import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, OneToMany} from "typeorm";
import { Product } from "./Product";
import { Stock } from "./Stock";
import { User } from "./User";


@Entity()
export class Company extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Stock, stock => stock.company)
    stocks: Stock[];

    @OneToMany(type => Product , product => product.company)
    products: Product[];

    @OneToMany(type => User , user => user.company)
    users: User[];
}