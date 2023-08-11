import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import * as dotenv from 'dotenv'; // must have
// authentication middleware
// eslint-disable-next-line import/extensions
import checkToken from './authentication/auth.js';
import { userRoute, studentsRoute } from './routes/index.js';
import connect from './database/database.js';

dotenv.config();
const app = express();
app.use(checkToken); // khiêng bảo vệ => checkToken => đúng mới cho thực hiện actions khác

// app.use(cors());

app.use(express.json());

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
