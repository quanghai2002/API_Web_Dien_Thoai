import jwt from 'jsonwebtoken';
import { print, outputType } from '../helpers/print.js';

const checkToken = (req, res, next) => {

    // không áp dụng=> login, register
    if (req?.url?.toLowerCase().trim() === '/users/login' || req?.url?.toLowerCase().trim() === '/users/register') {
        next();
        return
    }
    // other request
    // get and validate => token
    const token = req?.headers?.authorization?.split(" ")[1];
    try {
        const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
        const isExpired = Date.now() >= jwtObject.exp * 1000;
        if (isExpired) {
            res.status(401).json({
                message: 'token đã hết hạn',
            });
            res.end();
        }
        else {
            next();
            return

        }

    }
    catch (error) {
        print(error, outputType.ERROR)
        res.status(500).json({
            message: 'token đã hết hạn',
        })

    }




}

export default checkToken;