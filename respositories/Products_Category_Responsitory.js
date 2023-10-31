import { MAX_RECORDS } from "../Global/constants.js";
import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
// import { Student } from "../models/index.js";
import { ProductCategorySchema } from '../models/index.js';
// import { faker } from '@faker-js/faker/locale/vi';



// insert danh mục sản phẩm
const insertProductCategory = async ({ name, products }, res) => {

  try {

    // check xem đã tồn tại danh mục sản phẩm chưa => nếu chưa tạo mới
    const isNameCategory = await ProductCategorySchema.findOne({ name: name });

    // nếu tồn tại danh mục sản phẩm => thì update lại danh mục sản phẩm => bằng data req gửi lên
    if (!!isNameCategory) {
      print('Danh mục Sản Phẩm đã tồn tại, Cập nhật danh sách sản phẩm bên trong thành công', outputType.SUCCESS);

      isNameCategory.name = name ?? isNameCategory.name; // ?? null,undefined lay gia tri thu 2
      isNameCategory.products = products ?? isNameCategory.products; // ?? null,undefined lay gia tri thu 2

      await isNameCategory.save();

      res.status(200).json({
        message: 'Danh mục sản phẩm đã tồn tại, Cập nhật danh sách sản phẩm bên trong thành công',
        data: isNameCategory,
      })
    }
    else {

      print('thêm MỚI =>  Danh mục Sản Phẩm thành công', outputType.SUCCESS);
      const category = await ProductCategorySchema.create({ name, products });
      res.status(200).json({
        message: 'Thêm danh mục sản phẩm thành công',
        data: category,
      })
    }


  } catch (error) {
    print(error, outputType.ERROR)
    console.log(error)
    // error from validation
    res.status(500).json({
      message: ` không thêm được DANH MỤC SẢN PHẨM sản phẩm, vui lòng thử lại! `,
    })

  }
};


// get danh mục sản phẩm => lấy các sản phẩm bên trong đó
const getProductCategory = async ({ name }, req, res) => {

  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const size = parseInt(req.query.size) || 3

  try {
    print('GET sản phẩm trong danh mục sản phẩm thành công', outputType.SUCCESS);

    const category = await ProductCategorySchema.findOne({ name })

      //  .limit(size)
      // .skip((page - 1) * size)

      .populate({
        path: 'products',
        // match: { age: { $gte: 21 } },
        // select: 'name -_id',
        options: {
          skip: (page - 1) * size,
          limit: size,
        }
      })
      .exec();
    // tổng số bản ghi liên quan đến products
    const countSumProducts = await ProductCategorySchema.findOne({ name })
      .populate({
        path: 'products',

      })
      .exec();

    res.status(200).json({
      message: 'GET sản phẩm trong danh mục sản phẩm thành công',
      currentPage: page,
      size,
      totalPages: Math.ceil(countSumProducts?.products.length / size),
      "page/pages": `${page}/${Math.ceil(countSumProducts?.products.length / size)}`, // trang hiện tại /trên tổng số trang
      data: category,
    })


  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` không GET được DANH MỤC SẢN PHẨM sản phẩm, vui lòng thử lại! `,
    })

  }
}







export default { insertProductCategory, getProductCategory }
