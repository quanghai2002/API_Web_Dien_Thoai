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
        let existingUser = await useResponsitorie.login({ email, password }, res)

        res.status(200).json({
            message: 'Login user successfully',
            data: existingUser
        })

    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'Login user failed'
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

    const { name, email, password, phoneNumber, address } = req.body;

    try {

        let user = await useResponsitorie.register({ name, email, password, phoneNumber, address });

        res.status(201).json({
            message: 'Register user successfully',
            data: user
        })


    } catch (error) {
        console.log(error)
        res.status(404).json({
            message: 'Register user failed'
        })

    }


    // Event Emitter
    myEvent.emit('event.register.user', {
        name,
        email,
        address,
        password,
        phoneNumber
    })

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
            size: filterUser.length,
            page,
            searchString,
            data: filterUser
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




export default { login, register, getAllUser, deleteUser, refreshToken, logout }


