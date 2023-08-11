import express from 'express';
import { studentsController } from '../controllers/index.js'
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();

// get all students  and pagination
router.get('/', studentsController.getAllStudents)

// get students buy id
router.get('/:id', studentsController.getStudentsBuyID)

// insert students => admin => mới được insert
router.post('/insert', verifyTokenAndAdmin, studentsController.insertStudents)

// insert => fake students => framework => FAKE
// router.post('/generateFakeStudent', studentsController.generateFakeStudent)  // khi cần fake lần đầu => điền nhiều bản ghi

//  update students
router.patch('/update', verifyTokenAndAdmin, studentsController.updateStudents)

// delete one student buy ID
router.get('/delete/:idDelete', verifyTokenAndAdmin, studentsController.deleteStudent)
//...
export default router;
