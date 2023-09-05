import { brandsResponsitoti } from "../respositories/index.js";
import { MAX_RECORDS } from '../Global/constants.js';
import { print, outputType } from "../helpers/print.js";


// insert thương hiệu sản phẩm
const insertBrands = async (req, res) => {
  try {
    await brandsResponsitoti.insertBrands(req?.body, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Thêm thương hiệu thất bại !, Vui lòng thử lại`,
    })
  }

}




// get danh mục sản phẩm => lấy các sản phẩm bên trong thương hiệu => sản phẩm đó
const getProductBrands = async (req, res) => {
  try {
    await brandsResponsitoti.getProductBrands(req?.body, req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `GET THƯƠNG HIỆU sản phẩm thất bại !, Vui lòng thử lại`,
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
  insertBrands,
  getProductBrands
}

