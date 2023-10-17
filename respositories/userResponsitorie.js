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
import Cookies from 'universal-cookie';

let refreshTokenMoi = [];

// reset password
const sendResetPasswordMail = asyncHandler(async (name, email, token, req, res) => {

    try {
        const transporter = await nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_NAME,
                pass: process.env.EMAIL_APP_PASSWORD
            }

        });



        const mailOptions = {
            from: process.env.EMAIL_NAME,
            to: email,
            subject: 'Reset password',
            html: `<p> Xin chào :${name} , Please coppy the link and <a href="http://localhost:8080/api/users/reset_password?tokens=${token}" > reset password  </a> </p> `
        };

        transporter.sendMail(mailOptions, (error, info) => {

            if (error) {
                console.log(error);
            } else {
                console.log(`Mail has been sent, email đã được gửi tới => ${info.accepted[0]}`);

                res.status(200).json({
                    message: 'Check email đã gửi để reset password',
                })

            }

        })

    } catch (error) {
        res.status(400).send({
            success: false,
            msg: error.message,
            message: 'không gửi được email',
        })
    }

}

)



// user login
const login = async ({ email, password }, res, req) => {

    // check user and email => database => đã tồn tại hay chưa
    // findOne db => User
    let existingUser = await User.findOne({ email: email }).exec();

    if (existingUser) {
        // nếu tìm thấy email => check password => xem có đúng không
        // so sánh password
        let isMatch = await bcrypt.compare(password.toString(), existingUser.password);
        if (isMatch) {
            // nếu đúng password
            print('login successful,đăng nhập thành công', outputType.SUCCESS);

            // create JWT => khi login successful => payload token -> not password user
            let { password, ...notShowPassword } = existingUser._doc;

            // TẠO accessToken => thời gian hết hạn nhanh hơn
            const accessToken = jwt.sign(
                {
                    ...notShowPassword,
                    admin: existingUser.admin,
                },
                process.env.JWT_SECRET,
                { expiresIn: 30 } // expires in 60s
                // { expiresIn: "16 days" } // expires in 16 day => ke tu khi login
                // { expiresIn: "1h" } // expires in 1h => ke tu khi login

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
                // sameSite: "strict"
                sameSite: "Lax"
            })

            // lưu refreshToken => vào cookie
            // const cookies = new Cookies();
            // cookies.set('refreshToken', refreshToken, { path: '/' });

            res.status(200).json({
                message: 'Đăng nhập thành công!',
                token: accessToken,
                refreshToken,
                data: {
                    ...notShowPassword,
                }
            })

        }
        // nếu sai password
        else {
            print('Wrong email or password !, sai mật khẩu hoặc email, thử lại !', outputType.ERROR);
            res.status(404).json({
                message: 'Login user failed, login thất bại, sai mật khẩu hoặc email, thử lại !'
            })
        }

    }
    // nếu không tìm thấy email => thông báo đăng nhập thất bại => vui lòng thử lại
    else {

        print('Wrong email or password !, sai mật khẩu hoặc email, thử lại !', outputType.ERROR);
        res.status(404).json({
            message: 'Login user failed, login thất bại, sai mật khẩu hoặc email, thử lại !'
        })

    }


}

// --------------------------------------------------

// LOGIN with =>  GOOGLE
const loginGoogle = async (req, res) => {

    // id Google account localhost 5173
    const idGoogle = process.env.CLIENT_ID_LOGIN_GOOGLE;

    // token login google
    const { code } = req.body;


    // 
    const oAuth2Client = new OAuth2Client(
        process.env.CLIENT_ID_LOGIN_GOOGLE,
        process.env.CLIENT_SECRET_GOOGLE,
        'postmessage',
    );

    // get token => decode
    const tokens = await oAuth2Client.getToken(code);

    //console.log({ tokens })

    // get token Id and exp
    const tokenId = tokens?.tokens?.id_token;
    const exp = tokens?.tokens?.expiry_date;

    // console.log({ tokenId });
    // console.log({ exp });

    // ------------------------------
    // exp => time hết hạn token => clientGoogle
    const expTokenClientGoogle = Number.parseFloat(exp);

    // check token => google => hết hạn hay chưa
    const isExpired = Date.now() >= expTokenClientGoogle * 1000;
    // console.log({ isExpired });

    console.log({ isExpired });
    // nếu token hết hạn => res => login lại
    if (isExpired) {
        print('Token GOOGLE => HẾT HẠN => Đăng nhập GOOGLE ACCOUNT THẤT BẠI', outputType.ERROR);
        res.status(500).json({
            message: 'Token GOOGLE => đã HẾT HẠN => Đăng nhập GOOGLE ACCOUNT THẤT BẠI',
            isLoginGoogle: false
        })

    }
    // nếu còn hạn thực hiện => bình thường
    else {
        // verify token google
        const client = new OAuth2Client(idGoogle);

        client.verifyIdToken({ idToken: tokenId, audience: idGoogle })
            .then(async (response) => {
                // data Login => with => GOOGLE
                const { email_verified, name, email, picture, exp } = response?.payload;


                if (email_verified) {
                    // tìm email đăng nhập
                    const userGoogle = await User.findOne({ email: email }).exec();
                    if (userGoogle) {
                        // ACCESS TOKEN
                        // tìm thấy email => đã REGISTER => trong database => Access token    expiresIn: '16d'
                        const token = jwt.sign({ _id: userGoogle._id, admin: userGoogle?.admin }, process.env.JWT_SECRET, { expiresIn: 30 });
                        // get info => user => db
                        const { _id, username, email, admin, orders, reviews, phoneNumber } = userGoogle;

                        userGoogle.img_url = picture ?? userGoogle.img_url;
                        await userGoogle.save();

                        // TẠO refreshToken  => lâu hết hạn hơn => sẽ được lưu trên cookies
                        const refreshToken = jwt.sign(
                            {
                                _id: userGoogle._id,
                                admin: userGoogle?.admin
                            },
                            process.env.JWT_SECRET,
                            // { expiresIn: 60} // expires in 60s
                            { expiresIn: "365 days" } // expires in 365 day => ke tu khi login
                        )
                        // refreshToken => refreshTokenMoi
                        refreshTokenMoi.push(refreshToken);



                        // res => return Fontend
                        print('Đăng nhập GOOGLE ACCOUNT thành công', outputType.SUCCESS);
                        res.status(200).json({
                            message: 'Login with GOOGLE => thành công',
                            token,
                            refreshToken,
                            data: {
                                _id,
                                username,
                                email,
                                phoneNumber,
                                picture,
                                admin,
                                orders,
                                reviews

                            }
                        })
                    }
                    else {
                        // không tìm thấy email => trong db => lưu mới vào database
                        // encode bcrypt password
                        const saltRounds = await bcrypt.genSaltSync(Number.parseFloat(process.env.SALT_ROUNDS));
                        const hashedPassword = await bcrypt.hash(email.toString(), saltRounds);
                        let password = hashedPassword;

                        let newUser = new User({
                            username: name,
                            email,
                            password,
                            address: "Account-Login-With-Google",
                            admin: false,
                            img_url: picture
                            // picture,
                            // exp,
                            // iat
                        });

                        // save => new user => database
                        const newUserGoogle = await newUser.save();
                        if (newUserGoogle) {
                            // Access Token
                            const token = jwt.sign({ _id: newUserGoogle._id }, process.env.JWT_SECRET, { expiresIn: 30 }); //expiresIn: '16d'

                            // TẠO refreshToken  => lâu hết hạn hơn => sẽ được lưu trên cookies
                            const refreshToken = jwt.sign(
                                {
                                    _id: newUserGoogle._id
                                },
                                process.env.JWT_SECRET,
                                // { expiresIn: 60} // expires in 60s
                                { expiresIn: "365 days" } // expires in 365 day => ke tu khi login
                            )
                            // refreshToken => refreshTokenMoi
                            refreshTokenMoi.push(refreshToken);

                            const { _id, username, email, admin, img_url } = newUserGoogle;
                            print('Đăng nhập GOOGLE ACCOUNT => thành công', outputType.SUCCESS);
                            res.status(200).json({
                                message: 'Đăng nhập GOOGLE ACCOUNT thành công, user dc thêm vào DB',
                                token,
                                refreshToken,
                                data: {
                                    _id, username, email, admin, img_url
                                    //  picture, exp, iat
                                },
                                exp
                            })
                        }

                        else {
                            console.log('đã xảy ra sự cố , lưu thất user Google=> thất bại')
                            res.status(404).json({
                                message: 'something went wrong, đã xảy ra sự cố ! => add USER GOOGLE => failed'
                            })

                        }

                    }
                }


            }).catch((error) => {
                console.log(error);
                console.log("không lọt vào đk đúng");
                res.status(400).json({
                    message: 'Login with GOOGLE => THẤT BẠI => verifyIdToken FAILED =>Nhập sai TOKEN Google',

                })
            })
    }


}


// loginPhoneNumber => đăng nhập số điện thoại
const loginPhoneNumber = async (req, res) => {

    const phoneNumber = req.body?.phone;
    // ACCESS Token create token
    const token = jwt.sign({ phoneNumber }, process.env.JWT_SECRET, { expiresIn: 30 }); // expiresIn: '16d'

    // REFRESH TOKEN
    // TẠO refreshToken  => lâu hết hạn hơn => sẽ trả về rectjs => lưu trên cookis => khi accesstoken => hết hạn => lấy refreshToken
    const refreshToken = jwt.sign(
        {
            phoneNumber
        },
        process.env.JWT_SECRET,
        // { expiresIn: 60} // expires in 60s
        { expiresIn: "365 days" } // expires in 365 day => ke tu khi login
    )
    // refreshToken => refreshTokenMoi
    refreshTokenMoi.push(refreshToken);

    print('Đăng nhập PHONE NUMBER thành công', outputType.SUCCESS);
    res.status(200).json({
        message: 'Login Phone Number=> đăng nhập số điện thoại thành công',
        token,
        refreshToken,
        data: {
            phoneNumber,
            admin: false  // mặc định đăng nhập bằng số điện thoại sẽ không là admin được OKE
        }

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
const register = async ({ username, email, password, phoneNumber, address }) => {
    // validation
    try {

        let existingUser = await User.findOne({ email }).exec();
        if (existingUser !== null) {
            throw new Exception('User already exists (Email đã tồn tại, nhập email khác !)');


        }
        else {
            // encode bcrypt password
            const saltRounds = await bcrypt.genSaltSync(Number.parseFloat(process.env.SALT_ROUNDS));
            const hashedPassword = await bcrypt.hash(password.toString(), saltRounds);

            // insert to database
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                phoneNumber,
                address
            })

            print('register success, đăng kí thành công', outputType.SUCCESS);
            // message client
            return {
                ...newUser._doc,
                password: "Not show",
            }

        }

    } catch (error) {
        // check model validations

        print(error, outputType.ERROR);
        throw new Exception('cannot register user,đăng kí thât bại !');


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
        sendResetPasswordMail(userData.username, userData.email, randomString, req, res);
        res.status(200).json({
            message: 'Cập nhật token trong user thành công',
            data

        })

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
        let refresTokenOld = await req.body?.refreshToken;

        console.log({ refresTokenOld })

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
                { expiresIn: "16 days" } // expires in 60s

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
                newAccessToken,
                newRefreshToken
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


// get 1 user
const getOneUser = async (req, res) => {
    let id = req?.params?.id;
    console.log({ id });
    try {
        const useGetOne = await User.findById(id).populate('orders');

        print("Lấy 1 USER theo ID thành công", outputType.SUCCESS)
        res.status(200).json({
            message: 'Lấy 1 USER theo ID thành công !',
            data: useGetOne
        });

    } catch (error) {
        print("Lấy 1 USER theo ID thất bại", outputType.ERROR);
        console.log({ error });
        res.status(500).json({
            message: 'Lấy 1 USER theo ID thất bại ! nhập đúng ID user',
        });
    }
}

// UPDATE user
const updateUser = async (req, res) => {

    const { _id, username, img_url, address, phoneNumber, orders } = req?.body;
    console.log({ _id });
    console.log({ username });
    console.log({ img_url });

    try {
        const userUpdate = await User.findById(_id);

        userUpdate.username = username ?? userUpdate.username;
        userUpdate.img_url = img_url ?? userUpdate.img_url;
        userUpdate.address = address ?? userUpdate.address;
        userUpdate.phoneNumber = phoneNumber ?? userUpdate.phoneNumber;
        userUpdate.orders = [...userUpdate?.orders, ...orders]

        await userUpdate.save();

        print("Cập nhật User thành công", outputType.SUCCESS)
        res.status(200).json({
            message: 'Cập nhật user thành công !',
            data: userUpdate
        });

    } catch (error) {
        print("Cập nhật User thất bại", outputType.ERROR);
        console.log({ error });
        res.status(500).json({
            message: 'Cập nhật Userthất bại ! nhập đúng ID user',
        });
    }
}


export default { login, register, getAllUser, deleteUser, refreshTokenlai, logout, forgetPassWord, resetPassword, loginGoogle, loginPhoneNumber, getOneUser, updateUser }