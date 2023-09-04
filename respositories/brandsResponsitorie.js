import { MAX_RECORDS } from "../Global/constants.js";
import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
// import { Student } from "../models/index.js";
import { brandSchema } from '../models/index.js';
// import { faker } from '@faker-js/faker/locale/vi';



// insert thương hiệu sản phẩm
const insertBrands = async ({ name, description, logo_url, products }, res) => {

  try {

    // check xem đã tồn tại thương hiệu  => nếu chưa tạo mới
    const isNameBrand = await brandSchema.findOne({ name: name });



    // nếu tồn tại thương hiệu => thì update lại thương hiệu => bằng data req gửi lên
    if (!!isNameBrand) {
      print('Thương hiệu sản phẩm đã tồn tại, Cập nhật danh sách sản phẩm bên trong thành công', outputType.SUCCESS);

      isNameBrand.name = name ?? isNameBrand.name; // ?? null,undefined lay gia tri thu 2
      isNameBrand.description = description ?? isNameBrand.description; // ?? null,undefined lay gia tri thu 2
      isNameBrand.logo_url = logo_url ?? isNameBrand.logo_url; // ?? null,undefined lay gia tri thu 2
      isNameBrand.products = products ?? isNameBrand.products; // ?? null,undefined lay gia tri thu 2

      await isNameBrand.save();

      res.status(200).json({
        message: 'Thương hiệu sản phẩm đã tồn tại, Cập nhật danh sách sản phẩm bên trong thành công',
        data: isNameBrand,
      })
    }
    else {

      print('thêm MỚI =>  Thương hiệu Sản Phẩm thành công', outputType.SUCCESS);
      const brands = await brandSchema.create({ name, description, logo_url, products });
      res.status(200).json({
        message: 'Thêm mới thương hiệu sản phẩm thành công',
        data: brands,
      })
    }


  } catch (error) {
    print(error, outputType.ERROR)
    console.log(error)
    // error from validation
    res.status(500).json({
      message: ` không thêm được THƯƠNG HIỆU, vui lòng thử lại! `,
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







export default { insertBrands, getProductCategory }
