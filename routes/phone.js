
import express from 'express';
// import { studentsController } from '../controllers/index.js';
import { phoneController } from '../controllers/index.js';
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();


// search students => theo tên sản phẩm
router.get('/search', phoneController.searchPhone);

// pagination and sort phone theo giá sản phẩm từ CAO đến THẤP => desc => giảm dần
router.get('/sort/price', phoneController.sortPhonePrice);

// pagination and sort phone theo giá sản phẩm từ THẤP đến CAO => asc => tăng dần
router.get('/sort/price_Asc', phoneController.sortPhonePrice_Asc);

// insert phone => chỉ => admin => mới được insert phone
router.post('/insert', verifyTokenAndAdmin, phoneController.insertPhone);

// insert => fake students => framework => FAKE
// router.post('/generateFakeStudent', studentsController.generateFakeStudent)  // khi cần fake lần đầu => điền nhiều bản ghi

//  update phone
router.patch('/update', verifyTokenAndAdmin, phoneController.updatePhone);

// delete one product buy ID
router.delete('/delete/:idDelete', verifyTokenAndAdmin, phoneController.deletePhone);


// delete nhiều => product buy danh sách ID
router.delete('/deletemany', verifyTokenAndAdmin, phoneController.deleteManyPhone);

// get 1 sản phẩm theo id 
router.get('/:id', phoneController.getPhoneBuyID);

// get all sản phẩm and pagination
router.get('/', phoneController.getAllPhone);


// lấy sản phẩm trong khoảng GIÁ cụ thể
router.post('/getPhone_Price_KhoangAB', phoneController.getPhonePrice_KhoangAB);

// lấy sản phẩm có RAM bằng bao nhiêu đó
router.post('/getPhone_RAM', phoneController.getPhoneRAM);

// lấy sản phẩm có ROM bằng bao nhiêu đó
router.post('/getPhone_ROM', phoneController.getPhoneROM);

// lấy sản phẩm trong khoảng kích thước MÀN HÌNH nào đó
router.post('/getPhone_KichThuocManHinh', phoneController.getPhoneKichThuocManHinh);

//...
export default router;


