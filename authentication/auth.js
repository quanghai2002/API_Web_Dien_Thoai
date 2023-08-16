import jwt from 'jsonwebtoken';
import { print, outputType } from '../helpers/print.js';


// check token là user đã đăng nhập
const checkToken = (req, res, next) => {
    // Authentication
    // không áp dụng=> login, register

    if (req?.url?.toLowerCase().trim() === '/api/users/login' || req?.url?.toLowerCase().trim() === '/api/users/register') {
        next()
        return;
    }

    // other request
    // get and validate => token => verify Token
    const token = req?.headers?.authorization?.split(' ')[1];
    try {
        const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
        const isExpired = Date.now() >= jwtObject.exp * 1000;
        if (isExpired) {
            res.status(401).json({
                message: 'token is valid,đã hết hạn',
            });
            res.end();
        } else {
            next();
        }
    } catch (error) {
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'token is valid, sai token',
        });
    }
};

// verifyTokenAndAdmin => khi là ADMIN => mới CRUD => ...
const verifyTokenAndAdmin = (req, res, next) => {
    // Authorization
    // chi admin moi co cac quyen 
    // không áp dụng=> login, register
    if (req?.url?.toLowerCase().trim() === '/api/users/login' || req?.url?.toLowerCase().trim() === '/api/users/register') {
        next()
        return;
    }
    // other request
    // get and validate => token => verify Token
    const token = req?.headers?.authorization?.split(' ')[1];
    try {
        const jwtObject = jwt.verify(token, process.env.JWT_SECRET);

        const isExpired = Date.now() >= jwtObject.exp * 1000;
        if (isExpired) {
            res.status(401).json({
                message: 'token is valid,đã hết hạn',
            });
            res.end();
        } else {

            if (jwtObject.admin) {
                next();
            }
            else {
                res.status(401).json({
                    message: 'bạn không phải admin => không đc CRUD',
                });
                res.end();
            }
        }
    } catch (error) {
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'token is valid, sai token',
        });
    }

}
export default checkToken;
export { verifyTokenAndAdmin }
