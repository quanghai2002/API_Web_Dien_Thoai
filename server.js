import express from 'express';
import * as dotenv from 'dotenv'; // must have
// authentication middleware
// eslint-disable-next-line import/extensions
import checkToken from './authentication/auth.js';
import { userRoute, phoneRoute, productCategory, brands, order, review, paymentVNP } from './routes/index.js';
// import { userRoute, studentsRoute } from './routes/index.js';
import connect from './database/database.js';
// const cors = require("cors");
import cors from "cors";
// lưu url hình ảnh
import path from 'path';
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);

//
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
// user
app.use('/api/users', userRoute);
// app.use('/api/students', studentsRoute);

// phone
app.use('/api/phone', phoneRoute);

// danh mục sản phẩm
app.use('/api/category', productCategory);

// thương hiệu sản phẩm brands
app.use('/api/brands', brands);

// đơn hàng của user
app.use('/api/order', order);

// review
app.use('/api/review', review);



// truy cập link ảnh => sau khi đã lưu
// Điều này cho phép bạn truy cập các tệp ảnh từ URL có định dạng như sau: http://yourdomain.com/uploads/ten-tep-anh.jpg.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// 
const post = process.env.POST || 8081;



// --------------------------------------TEST THANH TOÁN QUA VÍ VNP ------------------
app.use('/api/payment', paymentVNP);

//
app.listen(post, async () => {
    await connect();
    console.log(`listening on port ${post}`);
});


// 
// app.get('/', (req, res) => {
//     res.send('responsr from root route kk');
// });

//  thông báo khi server đang chạy
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'server_running.html');
    res.sendFile(filePath);
});