import express from 'express';
import { studentsController } from '../controllers/index.js'

const router = express.Router();

// get all students  and pagination
router.get('/', studentsController.getAllStudents)

// get students buy id
router.get('/:id', studentsController.getStudentsBuyID)

// insert students
router.post('/insert', studentsController.insertStudents)

// insert => fake students => framework => FAKE
// router.post('/generateFakeStudent', studentsController.generateFakeStudent)  // khi cần fake lần đầu => điền nhiều bản ghi

//  update students
router.patch('/update', studentsController.updateStudents)

// delete one student buy ID
router.get('/delete/:idDelete', studentsController.deleteStudent)
//...
export default router;
