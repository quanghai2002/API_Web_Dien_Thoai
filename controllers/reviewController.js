import { reviewResponsitorie } from "../respositories/index.js";
import { MAX_RECORDS } from '../Global/constants.js';
import { print, outputType } from "../helpers/print.js";


// insert review 
const insertReview = async (req, res) => {
  try {
    await reviewResponsitorie.insertReview(req?.body, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Thêm đánh giá thất bại !, Vui lòng thử lại`,
    })
  }

}




// get danh mục sản phẩm => lấy các sản phẩm bên trong thương hiệu => sản phẩm đó
// const getProductBrands = async (req, res) => {
//   try {
//     await brandsResponsitoti.getProductBrands(req?.body, req, res);

//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       message: `GET THƯƠNG HIỆU sản phẩm thất bại !, Vui lòng thử lại`,
//     })
//   }
// }





export default {
  insertReview,
}

