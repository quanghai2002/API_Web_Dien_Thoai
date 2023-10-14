import jwt from 'jsonwebtoken';
import { print, outputType } from '../helpers/print.js';


// check token là user đã đăng nhập
const checkToken = (req, res, next) => {
    // Authentication
    // không áp dụng=> login, register
    console.log('req:', req?.url)

    if (req?.url?.toLowerCase().trim() === '/api/users/login'
        || req?.url?.toLowerCase().trim() === '/api/users/register'
        || req?.url?.toLowerCase().trim() === '/api/users/forget_password'
        || req?.url?.trim() === '/api/users/refreshToken'
        || req?.url?.toLowerCase().trim() === '/api/users/logingoogle'
        || req?.url?.toLowerCase().trim().includes(`/api/users/reset_password?token=`)
        || req?.url?.toLowerCase().trim().includes(`/api/users/reset_password?tokens=`)
        || req?.url?.toLowerCase().trim().includes(`/api/users/loginphonenumber`)
        || req?.url?.trim().includes(`uploads/image_urls`)
        || req?.url?.trim().includes(`/favicon.ico`)
        || req?.url?.trim().includes(`/api/payment/`)
        || req?.url?.trim().includes(`api/payment/vnpay_return`)
        || req?.url?.trim().includes(`/api/phone?page=`)
        || req?.url?.trim().includes(`/api/phone/sort/price`)
        || req?.url?.trim().includes(`/api/phone/sort/price_Asc?`)
        || req?.url?.trim().includes(`/api/phone/getonephone`)
    ) {
        next()
        return;
    }
    else {
        // other request
        // get and validate => token => verify Token
        const token = req?.headers?.authorization?.split(' ')[1];
        try {
            const jwtObject = jwt.verify(token, process.env.JWT_SECRET);
            const isExpired = Date.now() >= jwtObject.exp * 1000;
            if (isExpired) {
                res.status(401).json({
                    message: 'token is valid,đã hết hạn => Đăng nhập lại',
                    expired: true

                });
                res.end();
            } else {
                next();
            }
        } catch (error) {
            print(error, outputType.ERROR);
            res.status(500).json({
                message: 'token is nhập sai token, đã hết hạn token',
            });
        }

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
                message: 'token is valid,đã hết hạn => Đăng nhập lại',
                expired: true
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
            message: 'token is valid, nhập sai token',
        });
    }

}
export default checkToken;
export { verifyTokenAndAdmin }
