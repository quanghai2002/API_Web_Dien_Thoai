
import express from 'express';
// import { studentsController } from '../controllers/index.js';
import { reviewController } from '../controllers/index.js';
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();

// insert REVIEW 
router.post('/insert', reviewController.insertReview);


// update REVIEW
router.post('/update', reviewController.updateReview);


// delete REVIEW
router.get('/delete/:idDelete', reviewController.deleteReview);

// get Thương hiệu=> và lấy thông tin các sản phẩm bên trong => 1 thương hiệu sản phẩm đó
// router.post('/getCategory', brandsController.getProductBrands);

//...
export default router;


