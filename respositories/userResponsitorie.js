import { response } from 'express';
import Exception from '../exceptions/Exception.js';
import { print, outputType } from '../helpers/print.js';
import { User } from '../models/index.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

let refreshTokenMoi = [];

// user login
const login = async ({ email, password }, res) => {

    // check user and email => database
    // findOne db => User
    let existingUser = await User.findOne({ email: email }).exec();

    if (existingUser) {
        // so sanh password
        let isMatch = await bcrypt.compare(password.toString(), existingUser.password);
        if (isMatch) {
            print('login successful', outputType.SUCCESS);
            // create JWT => khi login successful => payload token -> not password user
            let { password, ...notShowPassword } = existingUser._doc;

            // TẠO accessToken => thời gian hết hạn nhanh hơn
            const accessToken = jwt.sign(
                {
                    ...notShowPassword,
                    admin: existingUser.admin,
                },
                process.env.JWT_SECRET,
                // { expiresIn: 60} // expires in 60s
                { expiresIn: "7 days" } // expires in 10 day => ke tu khi login

            );

            // TẠO refreshToken  => lâu hết hạn hơn => sẽ được lưu trên cookies
            const refreshToken = jwt.sign(
                {
                    ...notShowPassword,
                    admin: existingUser.admin,
                },
                process.env.JWT_SECRET,
                // { expiresIn: 60} // expires in 60s
                { expiresIn: "365 days" } // expires in 365 day => ke tu khi login
            )
            // refreshToken => refreshTokenMoi
            refreshTokenMoi.push(refreshToken);

            // Lưu refreshToken => cookies =>
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameTime: "strict"
            })

            return {
                ...notShowPassword,
                token: accessToken,
            }
        }
        else {
            throw new Exception('Wrong email or password !');
        }

    }
    else {
        throw new Exception('Wrong email or password!');
    }


}

/// user logout => clear refresh token
// access token => clear => redux store
const logout = async (req, res) => {
    try {

        res.clearCookie("refreshToken");
        res.status(200).json({
            message: 'LOGOUT => clear =>refresh token => successfully',
        })

    } catch (error) {
        print(error, outputType.ERROR);

    }
}


// register user
const register = async ({ name, email, password, phoneNumber, address }) => {
    // validation
    try {

        let existingUser = await User.findOne({ email }).exec();
        if (existingUser !== null) {
            throw new Exception('User already exists (Email tồn tại)');


        }
        else {
            // encode bcrypt password
            const saltRounds = await bcrypt.genSaltSync(Number.parseFloat(process.env.SALT_ROUNDS));
            const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);

            // insert to database
            const newUser = await User.create({
                name,
                email,
                password: hashedPassword,
                phoneNumber,
                address
            })

            print('register success', outputType.SUCCESS);
            // message client
            return {
                ...newUser._doc,
                password: "Not show",
            }

        }

    } catch (error) {
        // check model validations

        print(error, outputType.ERROR);
        throw new Exception('cannot register user');


    }


}

// get All user
const getAllUser = async ({ page, size, searchString }) => {
    // aggreate data for all . get data students
    size = Number.parseInt(size);
    page = Number.parseInt(page);

    // searchString ? name, email, address contains searchString
    let filterUser = await User.aggregate([
        {
            $match: {
                $or: [
                    {
                        name: { $regex: `.*${searchString}.*`, $options: 'i' } // ignore case
                    },
                    {
                        email: { $regex: `.*${searchString}.*`, $options: 'i' } // ignore case
                    },
                    {
                        address: { $regex: `.*${searchString}.*`, $options: 'i' } // ignore case
                    },
                ]
            }
        },
        // pagination
        { $skip: (page - 1) * size },

        // limit user/ pagination
        { $limit: size },

    ]);
    let count = await User.count();
    return { filterUser, count };
}

// delete one user
const deleteUser = async (req, res) => {
    let id = req.params.id
    try {
        const userDelete = await User.findByIdAndDelete(id);
        return userDelete;

    } catch (error) {
        throw new Exception('Delete user failed');
    }

}

// refreshToken khi access token => hết hạn
const refreshTokenlai = async (req, res) => {
    // khi access token => hết hạn =>
    // lấy refreshToken => từ user => user =>refreshToken lấy cookies
    try {
        // take refresh token => user
        let refresTokenOld = await req.headers.cookie.split('=')[1];

        if (!refresTokenOld) {
            return res.status(401).json({
                message: 'bạn chưa đăng nhập => chưa có token',
            })
        }

        // console.log({ refreshTokenMoi })
        // console.log({ refresTokenOld })
        // console.log('ketqua', refreshTokenMoi.includes(refresTokenOld))
        if ((refreshTokenMoi.includes(refresTokenOld)) === false) {
            return res.status(403).json("refreshToken không phải của tôi");

        }


        jwt.verify(refresTokenOld, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log('verify token error')
                print(err, outputType.ERROR);

            }

            const refresTokens = refreshTokenMoi.filter((token) => token !== refresTokenOld);


            // nếu không có lỗi => verify successfully => tạo => newAccessToken and  newRefreshToken
            // create payload new 
            const payloadNew = {
                _id: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                address: user.address,
                admin: user.admin,

            }
            //create new accesstoken
            const newAccessToken = jwt.sign(
                payloadNew,
                process.env.JWT_SECRET,
                { expiresIn: "7 days" } // expires in 60s

            )
            //new refresh token
            const newRefreshToken = jwt.sign(
                payloadNew,
                process.env.JWT_SECRET,
                { expiresIn: "365 days" } // expires in 365 day => ke tu khi login
            )

            refresTokens.push(newRefreshToken);

            // refreshTokenMoi.push(newRefreshToken);
            // //lưu lại newRefreshToken => cookie
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                sameTime: "strict"
            })

            res.status(200).json({
                message: 'refreshToken successfully',
                newAccessToken
            })
        })



    } catch (error) {
        console.log(error)
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'refreshToken failed',
        })
    }


}

export default { login, register, getAllUser, deleteUser, refreshTokenlai, logout }