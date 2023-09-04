
// import { studentResponsitorie } from "../respositories/index.js";
import { productCategory } from "../respositories/index.js";
import { MAX_RECORDS } from '../Global/constants.js';
import { print, outputType } from "../helpers/print.js";


// insert danh mục sản phẩm
const insertProductCategory = async (req, res) => {
  try {
    await productCategory.insertProductCategory(req?.body, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Thêm danh mục sản phẩm thất bại !, Vui lòng thử lại`,
    })
  }

}

// get danh mục sản phẩm => lấy các sản phẩm bên trong đó
const getProductCategory = async (req, res) => {
  try {
    await productCategory.getProductCategory(req?.body, req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `GET danh mục sản phẩm thất bại !, Vui lòng thử lại`,
    })
  }

}

// export default {
//   getAllStudents,
//   getStudentsBuyID,
//   updateStudents,
//   insertStudents,
//   deleteStudent,
//   sortStudent,
//   searchStudent,
//   generateFakeStudent // có thể xóa => fake data
// }

export default {
  insertProductCategory,
  getProductCategory
}

