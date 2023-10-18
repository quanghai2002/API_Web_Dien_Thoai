import express from 'express';
// import { studentsController } from '../controllers/index.js';
import { orderController } from '../controllers/index.js';
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();

// insert 1 đơn hàng
router.post('/insert', orderController.insertOrder);


// insert many đơn hàng 1 lúc => thêm nhiều đơn hàng 1 lúc
router.post('/insertmany', orderController.insertOrderMany);

// update đơn hàng 
router.post('/update', orderController.updateOrder);

// delete 1 đơn hàng
router.get('/delete/:idDelete', orderController.deleteOrder);

// delete NHIỀU đơn hàng => 
router.post('/deletemany', orderController.deleteOrderMany);

// GET List đơn hàng => 
router.get('/getall', orderController.getListOrder);

// SORT List đơn hàng theo DATE=> 
router.get('/sortdate', orderController.getListOrderSortDate);

// TÌM đơn hàng theo Status và SORT theo DATE=> admin mới được quyền
router.post('/getorderbystatus', orderController.getOrderByStatus);

// get 1 đơn hàng theo id 
router.get('/getbuyid/:id', orderController.getOrderByID);

export default router;

