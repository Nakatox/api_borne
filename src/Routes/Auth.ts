import { User } from '../Models/User';
import * as sha512 from 'js-sha512';
import * as jwt from 'jsonwebtoken';
import express from 'express';
require('dotenv').config();

let router = express.Router();

router.post('/auth', async (req, res) => {

    let user = await User.findOne({where: { email: req.body.email, password: sha512.sha512(req.body.password)}})

    let token = jwt.sign({id: user.id}, process.env.HASH_PASSWORD)

    res.json({status: 200, data: token});
})

export default router;
