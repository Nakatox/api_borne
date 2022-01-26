import { createConnection} from "typeorm";
require('dotenv').config();

import { Company } from "./Models/Company";
import { Ingredient } from "./Models/Ingredient";
import { Order } from "./Models/Order";
import { OrderhasProduct } from "./Models/OrderhasProduct";
import { Product } from "./Models/Product";
import { ProducthasIngredient } from "./Models/ProducthasIngredient";
import { Role } from "./Models/Role";
import { State } from "./Models/State";
import { Stock } from "./Models/Stock";
import { User } from "./Models/User";

export const connexion = () => createConnection({
    type: "mysql",
    host: "localhost",
    port: 8889,
    username: "root",
    password: "root",
    database: "api_borne",
    entities: [
        Company,
        Ingredient,
        Order,
        OrderhasProduct,
        Product,
        ProducthasIngredient,
        Role,
        Stock,
        User,
        State
    ],
    synchronize: true,
    logging: false
})