import { studentResponsitorie } from "../respositories/index.js";
import { MAX_RECORDS } from '../Global/constants.js';
import { print, outputType } from "../helpers/print.js";

// get students and pagination
const getAllStudents = async (req, res) => {
    // pagination  => phân trang
    //http://.../students?page=1&size=60

    let { page = 1, size = MAX_RECORDS, searchString = '' } = req.query;

    size = size >= MAX_RECORDS ? MAX_RECORDS : size;

    try {

        let filterStudent = await studentResponsitorie.getAllStudents({
            size,
            page,
            searchString
        })

        res.status(200).json({
            message: 'Get all students successfully',
            size: filterStudent.length,
            page,
            searchString,
            data: filterStudent
        })
        print('Get all students successfully', outputType.SUCCESS);



    } catch (error) {
        res.status(500).json({
            message: 'wrong all students failed !',
        })
        print(error, outputType.ERROR);

    }

}

// get student buy ID
const getStudentsBuyID = async (req, res) => {

    let studentsId = req.params.id;

    try {
        const student = await studentResponsitorie.getStudentBuyID(studentsId);
        res.status(200).json({
            message: 'Get students buy ID successfully',
            data: student
        })



    } catch (error) {
        res.status(500).json({
            message: 'wrong failed student Buy ID !',
        })
        print(error, outputType.ERROR);
    }
}


// update students => id
const updateStudents = async (req, res) => {

    const { id, name, email, languages, gender, phoneNumber, address } = req.body;

    try {

        const student = await studentResponsitorie.updateStudent({ id, name, email, languages, gender, phoneNumber, address });
        res.status(200).json({
            message: 'UPDATE students successfully',
            data: student,
        })
    } catch (error) {
        res.status(500).json({
            message: `UPDATE students failed`,
        })
    }

}

// insert student
const insertStudents = async (req, res) => {
    try {
        const students = await studentResponsitorie.insertStudents(req.body);
        res.status(200).json({
            message: 'Post insert students successfully',
            data: students,
        })
    } catch (error) {
        res.status(500).json({
            message: `không insert students failed`,
        })
    }

}


// delete student 
const deleteStudent = async (req, res) => {
    let studentId = req.params.id;
    try {
        const studentDeleteCount = await studentResponsitorie.deleteStudent(studentId);
        res.status(200).json({
            message: 'DELETE students buy ID successfully',
            countDelete: studentDeleteCount.deletedCount
        })



    } catch (error) {
        res.status(500).json({
            message: 'wrong DELETE student Buy ID !',
        })
        print(error, outputType.ERROR);
    }
}

//generateFakeStudent -> fake data
const generateFakeStudent = async (req, res) => {
    await studentResponsitorie.generateFakeStudent(req.body);
    res.status(200).json({
        message: 'fake data => students successfully',
    })

}


export default {
    getAllStudents,
    getStudentsBuyID,
    updateStudents,
    insertStudents,
    deleteStudent,
    generateFakeStudent // có thể xóa => fake data
}