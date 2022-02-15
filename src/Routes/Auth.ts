import { User } from '../Models/User';
import * as sha512 from 'js-sha512';
import * as jwt from 'jsonwebtoken';
import express, { Request, Response } from 'express';
require('dotenv').config();

let router = express.Router();

router.post('/auth', async (req: Request, res: Response) => {

    let user = await User.findOne({where: { name: req.body.name, password: sha512.sha512(req.body.password)}})

    if (user){
        let token = jwt.sign({id: user.id}, process.env.HASH_PASSWORD)

        res.json({status: 200, token: token});
    }else{
        res.json({status: 500, data: 'bad credentials'});
    }

})

export default router;
