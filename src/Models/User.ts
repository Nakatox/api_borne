import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany} from "typeorm";
import { Company } from "./Company";
import { Order } from "./Order";
import {Role} from "./Role";

@Entity()
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    password: string;

    @ManyToOne(type => Role, role => role.users)
    role: Role;

    @OneToMany(type => Order, order => order.user)
    orders: Order;

    @ManyToOne(type => Company, company => company.users)
    company: Company;
}