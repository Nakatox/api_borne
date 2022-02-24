import {Entity, Column, PrimaryGeneratedColumn, BaseEntity, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { Company } from "./Company";
import { Order } from "./Order";
import {Role} from "./Role";

@Entity()
export class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({select: false})
    password: string;

    @Column({name: 'roleid'})
    roleId: number;

    @Column({name: 'companyid'})
    companyId: number;

    @ManyToOne(type => Role, role => role.users)
    @JoinColumn({name: "roleid"})
    role: Role;

    @OneToMany(type => Order, order => order.user)
    orders: Order[];

    @ManyToOne(type => Company, company => company.users)
    @JoinColumn({name: "companyid"})
    company: Company;
}