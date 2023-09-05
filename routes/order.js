import express from 'express';
// import { studentsController } from '../controllers/index.js';
import { orderController } from '../controllers/index.js';
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();

// insert đơn hàng
router.post('/insert', orderController.insertOrder);

// update đơn hàng => admin của shop mới được chỉnh sửa đơn hàng
router.post('/update', verifyTokenAndAdmin, orderController.updateOrder);

// delete 1 đơn hàng
router.get('/delete/:idDelete', orderController.deleteOrder);

// delete NHIỀU đơn hàng => admin mới được quyền xóa nhiều đơn hàng
router.post('/deletemany', verifyTokenAndAdmin, orderController.deleteOrderMany);

// GET List đơn hàng => admin mới được quyền xóa nhiều đơn hàng
router.get('/getall', verifyTokenAndAdmin, orderController.getListOrder);

// SORT List đơn hàng theo DATE=> admin mới được quyền xóa nhiều đơn hàng
router.get('/sortdate', verifyTokenAndAdmin, orderController.getListOrderSortDate);

// TÌM đơn hàng theo Status và SORT theo DATE=> admin mới được quyền
router.post('/getorderbystatus', verifyTokenAndAdmin, orderController.getOrderByStatus);

// get 1 đơn hàng theo id 
router.get('/getbuyid/:id', verifyTokenAndAdmin, orderController.getOrderByID);

export default router;

