import express from 'express';
import { User } from '../Models/User';
import { checkRoleMidlewareAdmin } from '../Services/CheckRole';
import { UserValidator } from '../Validator/UserValidator';
import * as validator from 'express-validator';


let router = express.Router();

router.get('/users', checkRoleMidlewareAdmin, async (req, res) => {
    let users = await User.find({where:{role:req.query.role }});
    res.json({status: 200, data: users});
})

router.post('/users',checkRoleMidlewareAdmin, UserValidator,(req, res) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        User.save(req.body).then(user => {
            res.json({status: 200, data: user});
        }).catch(err => {
            res.json({status: 500, data: err});
        })
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.put('/users', checkRoleMidlewareAdmin, UserValidator, (req, res) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        User.update(req.params.id, req.body).then(user => {
            res.json({status: 200, data: user});
        }).catch(err => {
            res.json({status: 500, data: err});
        })
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.delete('/users/:id', checkRoleMidlewareAdmin, async (req, res) => {
    let user = await User.delete(req.params.id);
    res.json({status: 200, data: user});
})