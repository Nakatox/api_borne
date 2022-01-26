
export const checkRoleMidlewareAdmin = (req, res, next) => {
    if (req.user.role.name === 'admin') {
        next();
    } else {
        res.status(401).json({
        status: 401,
        message: 'Unauthorized'
        })
    }
}

export const checkRoleMidlewareCook = (req, res, next) => {
    if (req.user.role.name === 'cook' || req.user.role.name === 'admin') {
        next();
    } else {
        res.status(401).json({
        status: 401,
        message: 'Unauthorized'
        })
    }
}

