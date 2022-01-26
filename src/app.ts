import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
let cors = require('cors');
import * as bodyParser from 'body-parser';
const jwtExpress = require('express-jwt');
require('dotenv').config();

import ProductRoute from './Routes/Product';
import CompagnyRoute from './Routes/Company';

// connexion to the database
import { connexion } from './database';
import { User } from './Models/User';
connexion();

// setup express and socket.io
const app = express();
app.use(cors())
app.use(bodyParser.json());
// app.use(jwtExpress({ secret: process.env.HASH_PASSWORD, algorithms: ['HS256'] }).unless({ path: ['/auth'] }));
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
        }
    }
}
app.use( async (req, res, next) => {
    if (req.user){
        req.user = await User.findOne({where: { id: req.user.id}});
        next()
    }else{
        next()
    }
    req.io = io;
})

app.get('/', (req, res) => {
  res.send(process.env.HASH_PASSWORD);
});

app.use(ProductRoute);
app.use(CompagnyRoute);

// port
server.listen(8000);
