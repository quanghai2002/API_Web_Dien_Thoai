
import express from 'express';
// import { studentsController } from '../controllers/index.js';
import { productCategory } from '../controllers/index.js';
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();

// insert danh mục sản phẩm
router.post('/insert', productCategory.insertProductCategory);

// get danh mục sản phẩm => và lấy thông tin các sản phẩm bên trong đó
router.post('/getCategory', productCategory.getProductCategory);




//...
export default router;


