import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
import { Student } from "../models/index.js";
import { faker } from '@faker-js/faker/locale/vi';


// get all students and pagination

const getAllStudents = async ({ page, size, searchString }) => {

    // aggreate data for all . get data students
    size = Number.parseInt(size);
    page = Number.parseInt(page);
    // searchString ? name, email, address contains searchString
    let filterStudent = await Student.aggregate([

        {
            $match: {
                $or: [
                    {
                        name: { $regex: `.*${searchString}.*`, $options: 'i' } // ignore case
                    },
                    {
                        email: { $regex: `.*${searchString}.*`, $options: 'i' } // ignore case
                    },
                    {
                        address: { $regex: `.*${searchString}.*`, $options: 'i' } // ignore case
                    },
                ]
            }
        },

        { $skip: (page - 1) * size },

        { $limit: size },


    ]);

    // tong so trang tim duoc => khop voi yeu cau
    let count = await Student.count();

    return { filterStudent, count }

}

// searchStudent => tìm kiếm theo tên sản sinh viên ...
const searchStudent = async ({ searchName, page, limit }) => {

    let resultSearch = await Student.find({
        $or: [
            {
                name: { $regex: `.*${searchName}.*`, $options: 'i' } // ignore case
            },
        ]
    })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

    // tong so trang tim duoc
    const count = await Student.find({
        $or: [
            {
                name: { $regex: `.*${searchName}.*`, $options: 'i' } // ignore case
            },
        ]
    }).countDocuments();


    return { resultSearch, count }

}


// sortStudent
const sortStudent = async ({ page, size }) => {
    // aggreate data for all . get data students
    size = Number.parseInt(size);
    page = Number.parseInt(page);

    // Find First 10 News Items
    let sortStudent = await Student.find()
        .sort({ name: 1 })
        .skip((page - 1) * size)
        .limit(size);

    let count = await Student.count();

    return { sortStudent, count }


}



// get student buy ID
const getStudentBuyID = async (studentId) => {
    const student = await Student.findById(studentId);
    if (!student) {
        throw new Exception('Cannot file student buy ID');
    }
    return student;

}


// insert students
const insertStudents = async ({ name, email, languages, gender, phoneNumber, address }) => {

    try {
        print(' insertStudents successfully', outputType.SUCCESS);

        const students = await Student.create({ name, email, languages, gender, phoneNumber, address });
        return students;


    } catch (error) {
        print(error, outputType.ERROR)
        // error from validation
        res.status(500).json({
            message: `không insert students `,
        })

    }
}


// update students
const updateStudent = async ({ id, name, email, languages, gender, phoneNumber, address }) => {
    try {
        const student = await Student.findById(id);
        student.name = name ?? student.name; // ?? null,undefined lay gia tri thu 2
        student.email = email ?? student.email; // ?? null,undefined lay gia tri thu 2
        student.languages = languages ?? student.languages; // ?? null,undefined lay gia tri thu 2
        student.gender = gender ?? student.gender; // ?? null,undefined lay gia tri thu 2
        student.phoneNumber = phoneNumber ?? student.phoneNumber; // ?? null,undefined lay gia tri thu 2
        student.address = address ?? student.address; // ?? null,undefined lay gia tri thu 2

        await student.save();
        return student;

    }
    catch (error) {
        print(error, outputType.ERROR)
        // error from validation
        res.status(500).json({
            message: `update students failed `,
        })

    }
}

// delete student buy ID
const deleteStudent = async (studentId) => {
    try {
        const countDeleteStudent = await Student.deleteOne(studentId);
        return countDeleteStudent;

    } catch (error) {
        throw new Exception('Delete student failed');
    }
}



// generate fake  => 1000 students => fake
async function generateFakeStudent() {
    [...Array(100).keys()].forEach(async (items) => {

        let fakeStudents = {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            languages: faker.helpers.arrayElement(['Vietnamese', 'English', 'China', 'Nga']),
            gender: faker.helpers.arrayElement(["Nam", "Nữ"]),
            phoneNumber: faker.phone.number(),
            address: faker.location.cityName(),

        }
        await Student.create(fakeStudents);
        print(`Insert student name fake:${fakeStudents.name} - ${fakeStudents.phoneNumber}`);

    })

}



export default { getAllStudents, insertStudents, generateFakeStudent, getStudentBuyID, updateStudent, deleteStudent, sortStudent, searchStudent }