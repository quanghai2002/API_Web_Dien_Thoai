import { MAX_RECORDS } from "../Global/constants.js";
import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
// import { Student } from "../models/index.js";
import { reviewSchema } from '../models/index.js';
// import { faker } from '@faker-js/faker/locale/vi';



// insert thương hiệu sản phẩm
const insertReview = async ({ rating, comment, timestamp, user, product }, res) => {

  try {


    print('thêm MỚI =>  Review thành công', outputType.SUCCESS);

    const review = await reviewSchema.create({ rating, comment, timestamp, user, product });

    res.status(200).json({
      message: 'Thêm mới Review thành công',
      data: review,
    })



  } catch (error) {
    print(error, outputType.ERROR)
    console.log(error)
    // error from validation
    res.status(500).json({
      message: ` không thêm được Review, vui lòng thử lại! `,
    })


  }
};



// get danh mục sản phẩm => lấy các sản phẩm bên trong 1 thương hiệu sản phẩm đó
// const getProductBrands = async ({ name }, req, res) => {

//   console.log({ name });

//   const page = parseInt(req.query.page) || 1; // Page number, default to 1
//   const size = parseInt(req.query.size) || 3

//   try {
//     print('GET sản phẩm trong Thương hiệu  thành công', outputType.SUCCESS);

//     const category = await brandSchema.findOne({ name })

//       //  .limit(size)
//       // .skip((page - 1) * size)
//       .populate({
//         path: 'products',
//         // match: { age: { $gte: 21 } },
//         // select: 'name -_id',
//         options: {
//           skip: (page - 1) * size,
//           limit: size,
//         }
//       })
//       .exec();
//     // tổng số bản ghi liên quan đến products => đó trong Danh mục sản phẩm
//     const countSumProducts = await brandSchema.findOne({ name })
//       .populate({
//         path: 'products',

//       })
//       .exec();

//     res.status(200).json({
//       message: 'GET sản phẩm trong THƯƠNG HIỆU => thành công',
//       brand: name,
//       currentPage: page,
//       size,
//       totalPages: Math.ceil(countSumProducts?.products.length / size),
//       "page/pages": `${page}/${Math.ceil(countSumProducts?.products.length / size)}`, // trang hiện tại /trên tổng số trang
//       data: category,
//     })


//   } catch (error) {
//     print(error, outputType.ERROR)
//     // error from validation
//     res.status(500).json({
//       message: ` không GET được THƯƠNG HIỆU sản phẩm, vui lòng thử lại! `,
//     })

//   }
// }

export default { insertReview }
