import express from 'express';
import * as dotenv from 'dotenv'; // must have
// authentication middleware
// eslint-disable-next-line import/extensions
import checkToken from './authentication/auth.js';
import { userRoute, studentsRoute } from './routes/index.js';
import connect from './database/database.js';
// const cors = require("cors");
import cors from "cors";

dotenv.config();
const app = express();

// fix cross
const corsOptions = {
    origin: '*',
    credentials: true,    //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions))

// check token user
app.use(checkToken); // khiêng bảo vệ => checkToken => đúng mới cho thực hiện actions khác

app.use(express.json());

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next()
});

// routes
app.use('/api/users', userRoute);
app.use('/api/students', studentsRoute);


app.get('/', (req, res) => {
    res.send('responsr from root route kk');
});

// 
const post = process.env.POST || 3000;

app.listen(post, async () => {
    await connect();
    console.log(`listening on port ${post}`);
});
