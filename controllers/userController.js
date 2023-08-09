import { body, validationResult } from 'express-validator';
import { studentResponsitorie, useResponsitorie } from '../respositories/index.js';

import { EventEmitter } from 'node:events';
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
        let existingUser = await useResponsitorie.login({ email, password })

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
    res.send('Get all users');
}


export default { login, register, getAllUser }


