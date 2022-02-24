import express, { NextFunction, Request, Response } from 'express';
import http from 'http';
import { Server } from 'socket.io';
let cors = require('cors');
import * as bodyParser from 'body-parser';
const jwtExpress = require('express-jwt');
require('dotenv').config();

import ProductRoute from './Routes/Product';
import CompagnyRoute from './Routes/Company';
import UserRoute from './Routes/User';
import AuthRoute from './Routes/Auth';
import OrderRoute from './Routes/Order';
import IngredientRoute from './Routes/Ingredient';

// connexion to the database
import { connexion } from './database';
import { User } from './Models/User';
import { Role } from './Models/Role';
connexion();

// setup express and socket.io
const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(jwtExpress({ secret: process.env.HASH_PASSWORD, algorithms: ['HS256'] }).unless({ path: ['/auth'] }));
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: 'GET,PUT,POST,DELETE',
    }
});
// declare global 
declare global {
    namespace Express {
        interface Request {
            io: Server
            user: User
            role: Role
        }
    }
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
    
    if (req.user){
        req.user = await User.findOne({where: { id: req.user.id}});
        req.role = await Role.findOne({where: { id: req.user.roleId}});
        next()
    }else{
        next()
    }
    req.io = io;
})

app.get('/', (req: Request, res: Response) => {
  res.send(process.env.HASH_PASSWORD);
});

app.use(AuthRoute);
app.use(ProductRoute);
app.use(CompagnyRoute);
app.use(UserRoute);
app.use(OrderRoute);
app.use(IngredientRoute);

// port
server.listen(8000);
