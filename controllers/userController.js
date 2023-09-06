import { body, validationResult } from 'express-validator';
import { useResponsitorie } from '../respositories/index.js';

import { EventEmitter } from 'node:events';
import { print, outputType } from '../helpers/print.js';
import { MAX_RECORDS } from '../Global/constants.js';

const myEvent = new EventEmitter();
// listen


myEvent.on('event.register.user', (params) => {
    console.log(`They talked abount: ${JSON.stringify(params)}`)
})


// login user
const login = async (req, res) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        return res.status(404).json({ errors: result.array() });
    }

    const { email, password } = req.body


    try {
        //call repository
        await useResponsitorie.login({ email, password }, res)

    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'Login user failed, login thất bại, thử lại mật khẩu email !'
        })

    }
}



// LOGIN USER GOOGLE
const loginGoogle = async (req, res) => {

    try {
        //call repository
        await useResponsitorie.loginGoogle(req, res)


    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'Login google failed, đăng nhập với google thất bại '
        })

    }
}


// Login loginPhoneNumber
const loginPhoneNumber = async (req, res) => {

    try {
        //call repository
        await useResponsitorie.loginPhoneNumber(req, res)


    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'Login PhoneNumber failed, đăng nhập với số điện thoại thất bại !'
        })

    }
}

// user logout => clear refresh token
// access token => clear => redux store
const logout = async (req, res) => {
    try {
        await useResponsitorie.logout(req, res);
        print('LOGOUT user successfully', outputType.SUCCESS);
    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'LOGOUT user failed'
        })

    }
}


// register user
const register = async (req, res) => {

    const { username, email, password, phoneNumber, address } = req.body;

    try {

        let user = await useResponsitorie.register({ username, email, password, phoneNumber, address });

        res.status(200).json({
            message: 'Register user successfully, Đăng kí thành công !',
            data: user
        })


    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'Register user failed, email đã tồn tại'
        })

    }


    // Event Emitter
    // myEvent.emit('event.register.user', {
    //     name,
    //     email,
    //     address,
    //     password,
    //     phoneNumber
    // })

}

// get all user
const getAllUser = async (req, res) => {

    // pagination  => phân trang
    let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    try {

        let filterUser = await useResponsitorie.getAllUser({
            size,
            page,
            searchString
        });

        res.status(200).json({
            message: 'GET ALL user successfully ',
            size: filterUser.filterUser.length,
            page,
            pages: Math.ceil(filterUser.count / size), // tổng số các page
            "page/pages": `${page}/${Math.ceil(filterUser.count / size)}`, // trang hiện tại => trên tổng số trang
            searchString,
            data: filterUser.filterUser
        })
    } catch (error) {

        console.log(error)
        res.status(500).json({
            message: 'GET ALL user failed'
        })
    }
}

// delete one user
const deleteUser = async (req, res) => {

    try {
        let isDeleteUser = await useResponsitorie.deleteUser(req, res);
        console.log(isDeleteUser)
        print('DELETE one user successfully', outputType.SUCCESS);

        res.status(200).json({
            message: 'DELETE one user successfully',
            data: isDeleteUser
        })

    } catch (error) {
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'DELETE one user failed',

        })

    }

}

// Forget Password
const forget_password = async (req, res) => {

    try {

        useResponsitorie.forgetPassWord(req, res);

    } catch (error) {
        console.log('error', error);
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'forget password failed,',

        })
    }
}


//reset_password
const reset_password = async (req, res) => {

    try {
        let dataReset = await useResponsitorie.resetPassword(req, res);
        print('reset password successfully', outputType.SUCCESS);
        res.status(200).json({
            message: 'reset password successfully',
            'data_Reset': dataReset,

        })


    } catch (error) {
        console.log('error', error);
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'reset password failed',

        })
    }


}

// refreshToken khi access token => hết hạn
const refreshToken = async (req, res) => {
    // khi access token => hết hạn =>
    // lấy refreshToken => từ user => user =>refreshToken lấy cookies
    try {
        await useResponsitorie.refreshTokenlai(req, res);
        print('refreshToken successfully', outputType.SUCCESS);

    } catch (error) {
        console.log('error', error);
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'refreshToken failed',

        })
    }


}


// GET ONE user
const getOneUser = async (req, res) => {

    try {
        await useResponsitorie.getOneUser(req, res);

    } catch (error) {
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'GET ONE User thất bại !',
        })
    }
}

// Update user
const updateUser = async (req, res) => {

    try {
        await useResponsitorie.updateUser(req, res);

    } catch (error) {
        print(error, outputType.ERROR);
        res.status(500).json({
            message: 'Cập nhật USER thất bại !',
        })
    }
}

export default { login, register, getAllUser, deleteUser, refreshToken, logout, forget_password, reset_password, loginGoogle, loginPhoneNumber, getOneUser, updateUser }


