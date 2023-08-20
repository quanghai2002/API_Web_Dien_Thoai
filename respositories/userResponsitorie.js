import { response } from 'express';
import Exception from '../exceptions/Exception.js';
import { print, outputType } from '../helpers/print.js';
import { User } from '../models/index.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import randomstring from 'randomstring';
import asyncHandler from "express-async-handler";
import { OAuth2Client } from 'google-auth-library';

// reset password
const sendResetPasswordMail = asyncHandler(async (name, email, token) => {
    try {
        const transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_APP_PASSWORD
            }

        });

        const mailOptions = {
            from: process.env.EMAIL_NAME,
            to: email,
            subject: 'Reset password',
            html: `<p> Xin chào :${name} , Please coppy the link and <a href="http://localhost:3002/api/users/reset_password?token=${token}" > reset password  </a> </p> `
        };

        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                console.log(error);
            } else {
                console.log(`Mail has been sent => ${info.accepted[0]}`);
            }

        })

    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message
        })
    }

}

)

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

// --------------------------------------------------

// LOGIN Google
const loginGoogle = async (req, res) => {

    // toke login google
    const { tokenId } = req.body
    // id Google account localhost 5173
    const idGoogle = process.env.CLIENT_ID_LOGIN_GOOGLE;

    const client = new OAuth2Client(idGoogle);

    client.verifyIdToken({ idToken: tokenId, audience: idGoogle })
        .then(async (response) => {
            const { email_verified, name, email, picture, exp, iat } = response?.payload;


            if (email_verified) {

                const userGoogle = await User.findOne({ email: email }).exec();

                if (userGoogle) {
                    // tìm thaaysa email => trong db
                    const token = jwt.sign({ _id: userGoogle._id }, process.env.JWT_SECRET, { expiresIn: '16d' });
                    const { _id, name, email } = userGoogle;

                    //
                    print('Đăng nhập GOOGLE ACCOUNT thành công', outputType.SUCCESS);
                    res.status(200).json({
                        message: 'Login with GOOGLE => thành công',
                        token,
                        user: {
                            _id, name,
                            email,
                            picture,
                            exp, iat
                        }
                    })
                }
                else {
                    // encode bcrypt password
                    const saltRounds = await bcrypt.genSaltSync(Number.parseFloat(process.env.SALT_ROUNDS));
                    const hashedPassword = await bcrypt.hash(email.toString(), saltRounds);
                    let password = hashedPassword;

                    let newUser = new User({
                        name,
                        email,
                        password,
                        address: "Account-Login-With-Google"
                        // picture,
                        // exp,
                        // iat
                    });

                    const newUserGoogle = await newUser.save();
                    if (newUserGoogle) {
                        const token = jwt.sign({ _id: newUserGoogle._id }, process.env.JWT_SECRET, { expiresIn: '16d' });
                        const { _id, name, email } = newUserGoogle;
                        print('Đăng nhập GOOGLE ACCOUNT thành công', outputType.SUCCESS);
                        res.status(200).json({
                            message: 'Đăng nhập GOOGLE ACCOUNT thành công, user dc thêm vào DB',
                            token,
                            user: {
                                _id, name, email
                                //  picture, exp, iat
                            }
                        })
                    }

                    else {
                        console.log('đã xảy ra sự cố , lưu thất user Google thất bại')
                        res.status(404).json({
                            message: 'something went wrong, đã xảy ra sự cố !'
                        })

                    }

                }
            }


        }).catch((error) => {
            console.log(error)
        })




}



// --------------------------------------------------
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


// Forget password
const forgetPassWord = async (req, res) => {
    let email = req.body?.email;

    const userData = await User.findOne({ email: email });

    if (userData) {
        const randomString = randomstring.generate();
        const data = await User.updateOne({ email: email }, {
            $set: {
                token: randomString
            }
        })
        sendResetPasswordMail(userData.name, userData.email, randomString);
        return data

    }
    else {
        print('Không tìm thấy email', outputType.ERROR);
        res.status(500).json({
            message: 'không tìm thấy email',

        })
    }



}

// resetPassword
const resetPassword = async (req, res) => {

    const token = req?.query?.token;



    const tokenData = await User.findOne({ token: token });
    if (tokenData) {
        const password = req.body?.password;

        // encode bcrypt password
        const saltRounds = await bcrypt.genSaltSync(Number.parseFloat(process.env.SALT_ROUNDS));
        const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);

        let dataReset = User.findByIdAndUpdate({ _id: tokenData._id }, {
            $set: {
                password: hashedPassword,
                token: ''
            }
        },
            { new: true })

        return dataReset

    }
    else {
        print('Không tìm thấy email user', outputType.ERROR);
        res.status(500).json({
            message: 'không tìm thấy email user',

        })
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

export default { login, register, getAllUser, deleteUser, refreshTokenlai, logout, forgetPassWord, resetPassword, loginGoogle }