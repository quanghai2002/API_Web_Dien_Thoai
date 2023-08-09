import Exception from '../exceptions/Exception.js';
import { print, outputType } from '../helpers/print.js';
import { User } from '../models/index.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';

// user login
const login = async ({ email, password }) => {

    // check user and email
    // findOne db => User
    let existingUser = await User.findOne({ email: email }).exec();

    if (existingUser) {
        // so sanh pastwold
        let isMatch = await bcrypt.compare(password.toString(), existingUser.password);
        if (isMatch) {
            print('login successful', outputType.SUCCESS);

            // create JWT => khi login successful
            let token = jwt.sign(
                { data: existingUser },
                process.env.JWT_SECRET,
                // { expiresIn: 60} // expires in 60s
                { expiresIn: "2 days" } // expires in 10 day => ke tu login

            );

            return {
                ...existingUser.toObject(),
                token: token,
                password: 'not shown'

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



// register user
const register = async ({ name, email, password, phoneNumber, address }) => {
    // validation
    try {

        let existingUser = await User.findOne({ email }).exec();
        if (existingUser !== null) {
            throw new Exception('User already exists (Email tồn tại)');
        }


        // encode bcrypt password
        const saltRounds = bcrypt.genSaltSync(Number.parseFloat(process.env.SALT_ROUNDS));
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

    } catch (error) {
        // check model validations

        print(error, outputType.ERROR);
        throw new Exception('cannot register user');


    }


}



export default { login, register }