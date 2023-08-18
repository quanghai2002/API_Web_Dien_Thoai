import express from 'express';
import { studentsController } from '../controllers/index.js';
import { verifyTokenAndAdmin } from '../authentication/auth.js';

const router = express.Router();

// get all students  and pagination
router.get('/', studentsController.getAllStudents);

// search students
router.get('/search', studentsController.searchStudent);

// pagination and sort students
router.get('/sort', studentsController.sortStudent);

// insert students => admin => mới được insert
router.post('/insert', verifyTokenAndAdmin, studentsController.insertStudents);

// insert => fake students => framework => FAKE
// router.post('/generateFakeStudent', studentsController.generateFakeStudent)  // khi cần fake lần đầu => điền nhiều bản ghi

//  update students
router.patch('/update', verifyTokenAndAdmin, studentsController.updateStudents);

// delete one student buy ID
router.delete('/delete/:idDelete', verifyTokenAndAdmin, studentsController.deleteStudent);

// get students buy id
router.get('/:id', studentsController.getStudentsBuyID);


//...
export default router;
