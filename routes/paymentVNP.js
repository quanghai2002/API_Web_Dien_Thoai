import express from 'express';
import checkToken, { verifyTokenAndAdmin } from '../authentication/auth.js';
import moment from 'moment/moment.js';
const router = express.Router();

import crypto from 'crypto';
import querystring from 'qs';

// const request = require('request');
// const moment = require('moment');

const config = {
  vnp_TmnCode: "YKZPCTXY",
  vnp_HashSecret: "JRHXRLZMIHHLOJKNMINBEXKWECKIAOBZ",
  vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  vnp_ReturnUrl: "http://localhost:5173/payment/vnpay_return"
  // vnp_ReturnUrl: "http://localhost:5173/payment"

}



// tạo thanh toán VNP

router.post('/create_payment_url', function (req, res, next) {

  process.env.TZ = 'Asia/Ho_Chi_Minh';

  let date = new Date();
  let createDate = moment(date).format('YYYYMMDDHHmmss');

  // lấy địa chỉ IP khách hàng
  let ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  // let config = require('config');


  // let tmnCode = config.get('vnp_TmnCode');
  let tmnCode = config.vnp_TmnCode;
  // let secretKey = config.get('vnp_HashSecret');
  let secretKey = config.vnp_HashSecret;
  // let vnpUrl = config.get('vnp_Url');
  let vnpUrl = config.vnp_Url;
  // let returnUrl = config.get('vnp_ReturnUrl');
  let returnUrl = config.vnp_ReturnUrl;

  let orderId = moment(date).format('DDHHmmss');

  let amount = req.body.amount || 10000; // số tiền thanh toán
  let bankCode = req.body.bankCode;

  let locale = req?.body?.language || 'vn';
  // if (locale === null || locale === '') {
  //   locale = 'vn';
  // }

  let currCode = 'VND';
  let vnp_Params = {};
  vnp_Params['vnp_Version'] = '2.1.0';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;
  vnp_Params['vnp_Locale'] = locale; // ngôn ngữ giao diện hiển thị
  vnp_Params['vnp_CurrCode'] = currCode; // đơn vị tiền tệ VND
  vnp_Params['vnp_TxnRef'] = orderId; // Mã tham chiếu của giao dịch tại hệ thống của merchant. Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY. Không được trùng lặp trong ngày. V
  vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId; // thông tin nội dung thanh toán
  vnp_Params['vnp_OrderType'] = 'other'; // Mã danh mục hàng hóa
  vnp_Params['vnp_Amount'] = amount * 100; // số tiền thanh toán
  vnp_Params['vnp_ReturnUrl'] = returnUrl; // URL thông báo kết quả giao dịch khi Khách hàng kết thúc thanh toán.
  vnp_Params['vnp_IpAddr'] = ipAddr; // địa chỉ IP khách hàng
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '' && bankCode !== undefined) {
    vnp_Params['vnp_BankCode'] = bankCode; // mã ngân hàng
  }

  // sort
  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
  //
  vnp_Params = sortObject(vnp_Params);  // có ý nghĩa là bạn đang sắp xếp các thuộc tính của đối tượng vnp_Params theo thứ tự tăng dần của các khóa trong đối tượng. Điều này là cần thiết khi bạn muốn tạo một chuỗi ký tự cần được mã hóa và gửi đến một dịch vụ hoặc API.


  // let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });


  // let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");
  vnp_Params['vnp_SecureHash'] = signed;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });


  // console.log('data', {
  //   message: 'đang chuyển đến trang thanh toán',
  //   data: vnp_Params,
  //   urlRedirect: vnpUrl
  // })
  // //
  res.status(200).json({
    message: 'đang chuyển đến trang thanh toán',
    data: vnp_Params,
    urlRedirect: vnpUrl

  })

  // res.redirect(vnpUrl)
});


//
/*
Dữ liệu VNPAY trả về bằng cách chuyển hướng trình duyệt web của khách hàng theo địa chỉ web mà Merchant cung cấp khi gửi yêu cầu thanh toán. Trên URL này mang thông tin kết quả thanh toán của khách hàng.
*/
router.get('/vnpay_return', function (req, res, next) {
  let vnp_Params = req.query;

  // console.log('vnp_Params', vnp_Params)

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // sort
  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }

  vnp_Params = sortObject(vnp_Params);


  // let tmnCode = config.get('vnp_TmnCode');
  let tmnCode = config?.vnp_TmnCode;
  // let secretKey = config.get('vnp_HashSecret');
  let secretKey = config?.vnp_HashSecret;

  // let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  // let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");


  // console.log('signed', signed)

  if (secureHash === signed) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    // res.redirect('/payment/success'); // Chuyển hướng đến trang thành công

    console.log(' KẾT QUẢ GIAO DỊCH, GIAO DỊCH THÀNH CÔNG:', vnp_Params['vnp_ResponseCode'])
    res.status(200).json({
      message: 'Thanh Toán thành công',
      code: vnp_Params['vnp_ResponseCode']

    })
  } else {
    // res.render('success', { code: '97' })
    // Chuyển hướng đến trang thất bại
    res.status(500).json({
      message: 'Thanh Toán Thất Bại',
      code: 97

    })

    console.log('KẾT QUẢ GIAO DỊCH,GIAO DỊCH THẤT BẠI:', 97)
  }
});


/*
Đây là địa chỉ để nhận kết quả thanh toán từ VNPAY. Kết nối hiện tại sử dụng phương thức GET
Trên URL VNPAY gọi về có mang thông tin thanh toán để căn cứ vào kết quả đó Website TMĐT xử lý các bước tiếp theo (ví dụ: cập nhật kết quả thanh toán vào Database …)
*/

router.get('/vnpay_ipn', function (req, res, next) {
  let vnp_Params = req.query;
  let secureHash = vnp_Params['vnp_SecureHash'];

  let orderId = vnp_Params['vnp_TxnRef'];
  let rspCode = vnp_Params['vnp_ResponseCode'];  //	Mã phản hồi kết quả thanh toán. Quy định mã trả lời 00 ứng với kết quả Thành công cho tất cả các API

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  // sort
  function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
      if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
  }
  vnp_Params = sortObject(vnp_Params);
  // let config = require('config');
  let secretKey = config.get('vnp_HashSecret');
  // let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  // let crypto = require("crypto");
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");

  let paymentStatus = '0'; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
  //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
  //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó

  let checkOrderId = true; // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
  let checkAmount = true; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
  if (secureHash === signed) { //kiểm tra checksum
    if (checkOrderId) {
      if (checkAmount) {
        if (paymentStatus == "0") { //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
          if (rspCode == "00") {
            //thanh cong
            //paymentStatus = '1'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success, Thanh toán thành công' })
          }
          else {
            //that bai
            //paymentStatus = '2'
            // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
            res.status(200).json({ RspCode: '00', Message: 'Success' })
          }
        }
        else {
          res.status(200).json({ RspCode: '02', Message: 'This order has been updated to the payment status,đơn hàng nãy đã được cập nhật trạng thái thanh toán' })
        }
      }
      else {
        res.status(200).json({ RspCode: '04', Message: 'Amount invalid, số tiền không hợp lệ' })
      }
    }
    else {
      res.status(200).json({ RspCode: '01', Message: 'Order not found, Không tìm thấy đơn hàng' })
    }
  }
  else {
    res.status(200).json({ RspCode: '97', Message: 'Checksum failed, thanh toán đơn hàng thất bại' })
  }
});


export default router;