import mongoose from 'mongoose';
import { print, outputType } from '../helpers/print.js';
import Exception from '../exceptions/Exception.js';

async function connect() {
    try {
        const connection = await mongoose.connect(process.env.MONGO_URI);
        print('connect mongodb successfully', outputType.SUCCESS);
        return connection;
    } catch (error) {
        if (error.code === 8000) {
            // throw new Error('Wrong database UerName and Password');
            print('Wrong database UerName and Password', outputType.ERROR);
        } else if (error.code === 'ENOTFOUND') {
            throw new Exception('Wrong serverName/connection');
        }
        throw new Exception('Cannot connect Mongodb - MonggoExpress');
    }
}

export default connect;
