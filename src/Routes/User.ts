import express, { Request, Response } from 'express';
import { User } from '../Models/User';
import { checkRoleMidlewareAdmin } from '../Services/CheckRole';
import { UserValidator } from '../Validator/UserValidator';
import * as validator from 'express-validator';
import { Role } from '../Models/Role';


let router = express.Router();

router.get('/users', checkRoleMidlewareAdmin, async (req: Request, res: Response) => {
    const role = await Role.findOne({where:{name:req.query.role}});
    const users = await User.find({where:{roleId:role.id}});
    res.json({status: 200, data: users});
})

router.post('/users',checkRoleMidlewareAdmin, UserValidator, async (req: Request, res: Response) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        let user = await User.save(req.body);
        res.json({status: 200, data: user});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.put('/users', checkRoleMidlewareAdmin, UserValidator, async (req: Request, res: Response) => {

    const errors = validator.validationResult(req);

    if (errors.isEmpty()) {
        let user = await User.update(req.params.id, req.body)
        res.json({status: 200, data: user});
    }else{
        res.status(400).json({ errors: errors.array() });
    }
})

router.delete('/users/:id', checkRoleMidlewareAdmin, async (req: Request, res: Response) => {
    let user = await User.delete(req.params.id);
    res.json({status: 200, data: user});
})

export default router;