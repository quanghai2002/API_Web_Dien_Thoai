
import express from 'express';
// import { studentsController } from '../controllers/index.js';
import { brandsController } from '../controllers/index.js';
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();

// insert thương hiệu sản phẩm
router.post('/insert', brandsController.insertBrands);

// get danh mục sản phẩm => và lấy thông tin các sản phẩm bên trong đó
router.post('/getCategory', productCategory.getProductCategory);

//...
export default router;


