import { NextFunction, Request, Response } from "express";
import { Role } from "../Models/Role";


export const checkRoleMidlewareAdmin = async (req: Request, res: Response, next: NextFunction) => {
    if (req.role.name === 'admin') {
        next();
    } else {
        res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        })
    }
}

export const checkRoleMidlewareCook = async (req: Request, res: Response, next: NextFunction) => {

    if (req.role.name === 'cook' || req.role.name === 'admin') {
        next();
    } else {
        res.status(401).json({
            status: 401,
            message: 'Unauthorized'
        })
    }
}

