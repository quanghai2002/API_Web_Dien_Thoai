import { MAX_RECORDS } from "../Global/constants.js";
import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
// import { Student } from "../models/index.js";
import { Phone } from '../models/index.js';
import os from 'os';


// get all phone and có pagination
const getAllPhone = async ({ page, size }, res) => {

  size = Number.parseInt(size);
  page = Number.parseInt(page);

  try {
    // lấy ra số bản ghi theo yêu cầu and pagination
    let getAllPhone = await Phone.find({})
      .limit(size)
      .skip((page - 1) * size)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .exec();

    // tong so bản ghi của Phone
    const count = Number.parseFloat(await Phone.find().countDocuments());
    console.log({ count });

    res.status(200).json({
      message: 'Get all PHONE successfully',
      size,
      page,
      totalPages: Math.ceil(count / size),
      "page/pages": `${page}/${Math.ceil(count / size)}`, // trang hiện tại /trên tổng số trang
      data: getAllPhone
    })
    print('Get all PHONE successfully', outputType.SUCCESS);
  } catch (error) {
    res.status(500).json({
      message: 'get All phone thất bại',
    })
    print(error, outputType.ERROR);
  }


};

// get all phone KHÔNG Có pagination
const getAllPhoneNoPagination = async (req, res) => {

  try {
    // lấy tất cả sản phẩm => mui phân trang kk
    let getAllPhoneNoPaginaiton = await Phone.find()
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .exec();

    res.status(200).json({
      message: 'Get all PHONE => KHÔNG Có Pagination => successfully',
      data: getAllPhoneNoPaginaiton
    })
    print('Get all PHONE => Không có Pagonation => successfully', outputType.SUCCESS);
  } catch (error) {
    res.status(500).json({
      message: 'get All phone => Không có phân trang => thất bại',
    })
    print(error, outputType.ERROR);
  }


};

// searchPhone => tìm kiếm theo tên sản phẩm 

const searchPhone = async ({ searchName, page, limit }) => {

  let resultSearch = await Phone.find({
    $or: [
      {
        name: { $regex: `.*${searchName}.*`, $options: 'i' } // ignore case
      },
    ]
  })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .populate('category', '-_id -products -createdAt -updatedAt')
    .populate('brand', '-_id -products -createdAt -updatedAt')
    .exec();


  // tổng số trang tìm được
  const count = await Phone.find({
    $or: [
      {
        name: { $regex: `.*${searchName}.*`, $options: 'i' } // ignore case
      },
    ]
  }).countDocuments();

  return { resultSearch, count }
};

// sortPhone => theo giá sản phẩm => CAO => THẤP
const sortPhonePrice = async ({ page, size }) => {
  // aggreate data for all . get data students
  size = Number.parseInt(size);
  page = Number.parseInt(page);

  // Find First 10 News Items
  let sortPhonePrice = await Phone.find()
    .sort({ price: -1 })  //Sắp xếp giá từ cao đến thấp
    .skip((page - 1) * size)
    .limit(size)
    .populate('category', '-_id -products -createdAt -updatedAt')
    .populate('brand', '-_id -products -createdAt -updatedAt')
    .exec();

  let count = await Phone.countDocuments();
  console.log({ count });

  return { sortPhonePrice, count }


}


// sortPhone => theo giá sản phẩm => THẤP => CAO
const sortPhonePrice_Asc = async ({ page, size }) => {
  // aggreate data for all . get data students
  size = Number.parseInt(size);
  page = Number.parseInt(page);

  // Find First 10 News Items
  let sortPhonePrice = await Phone.find()
    .sort({ price: 1 })  //Sắp xếp giá Thấp => Cao
    .skip((page - 1) * size)
    .limit(size)
    .populate('category', '-_id -products -createdAt -updatedAt')
    .populate('brand', '-_id -products -createdAt -updatedAt')
    .exec();

  let count = await Phone.countDocuments();
  console.log({ count });

  return { sortPhonePrice, count }


}



// get 1 sản phẩm theo  ID
const getPhoneBuyID = async (phoneId, req, res) => {

  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const size = parseInt(req.query.size) || 3;

  console.log({ page })
  console.log({ size })

  try {

    const phoneOne = await Phone.findById(phoneId)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .populate({
        path: 'reviews',
        // match: { age: { $gte: 21 } },
        // select: 'name -_id',
        options: {
          skip: (page - 1) * size,
          limit: size,
        },
        populate: {
          path: 'user',
          model: 'User',
          select: 'username',
        }
      })
      .exec();

    // tổng số bản ghi liên quan đến Review => lấy tất cả bản ghi
    const countSumReview = await Phone.findById(phoneId)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .populate({
        path: 'reviews',
        populate: {
          path: 'user',
          model: 'User',
          select: 'username',

        }
      })
      .exec();

    // nếu tìm thấy sản phẩm theo id => cung cấp return fontend
    if (phoneOne) {
      res.status(200).json({
        message: 'Lấy 1 sản phẩm theo ID thành công !',
        currentPageReview: page,
        size,
        totalPagesReview: Math.ceil(countSumReview?.reviews?.length / size),
        "page/pages": `${page}/${Math.ceil(countSumReview?.reviews?.length / size)}`, // trang hiện tại /trên tổng số trang
        data: phoneOne
      });

      print('Lấy 1 sản phẩm theo ID thành công', outputType.SUCCESS);

    } else {
      res.status(500).json({
        message: 'Không tìm thấy sản phẩm theo ID bạn cung cấp, Thử lại !',
      });

      print('Không tìm thấy sản phẩm theo ID bạn cung cấp, Thử lại', outputType.ERROR);
    }


  } catch (error) {
    res.status(500).json({
      message: 'Lấy 1 sản phẩm theo ID thất bại !, Vui lòng thử lại',
    })
    print('Lấy 1 sản phẩm theo ID thất bại !, Vui lòng thử lại', outputType.ERROR);
  }


}


// insert phone
const insertPhone = async ({ name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion, category, brand, reviews }, res) => {

  try {
    print('thêm sản phẩm thành công', outputType.SUCCESS);

    const phone = await Phone.create({ name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion, category, brand, reviews });

    res.status(200).json({
      message: 'Thêm sản phẩm thành công',
      data: phone,
    })


  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` không thêm được sản phẩm, vui lòng thử lại! `,
    })

  }
}


// update  1 phone => CẬP NHẬT 1 SẢN PHẨM
const updatePhone = async ({ _id, name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion, category, brand, reviews, orders }, res) => {
  try {
    const phone = await Phone.findById(_id);

    phone.name = name ?? phone.name; // ?? null,undefined lay gia tri thu 2
    phone.description = description ?? phone.description; // ?? null,undefined lay gia tri thu 2
    phone.price = price ?? phone.price; // ?? null,undefined lay gia tri thu 2
    phone.dung_luong_pin = dung_luong_pin ?? phone.dung_luong_pin; // ?? null,undefined lay gia tri thu 2
    phone.mau_sac = mau_sac ?? phone.mau_sac; // ?? null,undefined lay gia tri thu 2
    phone.bo_nho = bo_nho ?? phone.bo_nho; // ?? null,undefined lay gia tri thu 2
    phone.kich_thuoc_man_hinh = kich_thuoc_man_hinh ?? phone.kich_thuoc_man_hinh; // ?? null,undefined lay gia tri thu 2
    phone.camera = camera ?? phone.camera; // ?? null,undefined lay gia tri thu 2
    phone.CPU = CPU ?? phone.CPU; // ?? null,undefined lay gia tri thu 2
    phone.RAM = RAM ?? phone.RAM; // ?? null,undefined lay gia tri thu 2
    phone.ROM = ROM ?? phone.ROM; // ?? null,undefined lay gia tri thu 2
    phone.he_dieu_hanh = he_dieu_hanh ?? phone.he_dieu_hanh; // ?? null,undefined lay gia tri thu 2
    phone.stock_quantity = stock_quantity ?? phone.stock_quantity; // ?? null,undefined lay gia tri thu 2
    phone.image_urls = image_urls ?? phone.image_urls; // ?? null,undefined lay gia tri thu 2
    phone.promotion = promotion ?? phone.promotion; // ?? null,undefined lay gia tri thu 2
    phone.category = category ?? phone.category;
    phone.brand = brand ?? phone.brand;
    phone.reviews = reviews ?? phone.reviews;
    phone.orders = orders ?? phone.orders;
    await phone.save();

    print('Cập nhật sản phẩm thành công', outputType.SUCCESS);
    res.status(200).json({
      message: 'Cập nhật sản phẩm thành công',
      data: phone,
    })

  }
  catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: `cập nhật sản phẩm thất bại, thử lại id `,
    })

  }
}

// update many phone -- CẬP NHẬT NHIỀU SẢN PHẨM 1 LÚC 
const updatePhoneMany = async (req, res) => {

  try {

    const phoneUpdates = req?.body; // Đây là danh sách các sản phẩm cần cập nhật
    // console.log('thông tin các sản phẩm cần cập nhật:', phoneUpdates);

    const updatedProducts = [];

    for (const update of phoneUpdates) {
      const productId = update?._id;
      const newStockQuantity = update?.stock_quantity;

      // Tạo điều kiện cập nhật cho sản phẩm cụ thể
      const updateCondition = { _id: productId };

      // Tạo đối tượng chứa trường cần cập nhật và giá trị mới
      const updateFields = {
        $set: {
          stock_quantity: newStockQuantity,
        },
      };
      // Sử dụng updateOne để cập nhật sản phẩm cụ thể
      // await Phone.updateOne(updateCondition, updateFields);
      const result = await Phone.updateOne(updateCondition, updateFields);

      if (result?.matchedCount > 0) {
        // Nếu sản phẩm đã được cập nhật thành công, thêm nó vào danh sách updatedProducts
        updatedProducts.push(productId);
      }
    };

    // Lấy thông tin các sản phẩm đã cập nhật thành công
    const updatedProductDetails = await Phone.find({ _id: { $in: updatedProducts } });

    print('Cập nhật nhiều sản phẩm thành công', outputType.SUCCESS);
    res.status(200).json({
      message: 'CẬP NHẬT NHIỀU SẢN PHẨM THÀNH CÔNG',
      data: updatedProductDetails,
    });

  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: `CẬP NHẬT NHIỀU SẢN PHẨM THẤT BẠI`,
    })
  }
}


// deletet 1 phone buy ID
const deletePhone = async (phoneId, res) => {
  try {
    const countDeletePhone = await Phone.findByIdAndDelete(phoneId);
    res.status(200).json({
      message: 'Xóa 1 sản phẩm thành công',
      productDelete: countDeletePhone
    })
    print('DELETE 1 product buy ID successfully', outputType.SUCCESS);

  } catch (error) {
    throw new Exception('Delete student failed');
  }
}

// deletet nhiều => phone buy  => list ID
const deleteManyPhone = async (req, res) => {

  const { idsListDelete } = req?.body;
  console.log(idsListDelete)

  try {

    let deletePhoneMany = await Phone.deleteMany({ _id: { $in: idsListDelete } })
    res.status(200).json({
      message: 'Xóa nhiều sản phẩm thành công',
      deletePhoneMany

    })
    print('xóa nhiều sản phẩm thành công.', outputType.SUCCESS);

  } catch (error) {
    print('Xóa nhiều sản phẩm thất bại ! Vui lòng thử lại', outputType.ERROR);

    res.status(200).json({
      message: 'Xóa nhiều sản phẩm thất bại ! Vui lòng thử lại',

    })
  }
}

// filter sản phẩm trong khoảng giá nào đó
const filterPhonePrice = async (req, res) => {
  try {

    let { page = 1, size = MAX_RECORDS } = req?.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;
    let { minPrice, maxPrice } = req?.body;

    size = Number.parseInt(size);
    page = Number.parseInt(page);
    minPrice = Number.parseFloat(minPrice);
    maxPrice = Number.parseFloat(maxPrice);

    // filter phone trong khoảng giá nào đó 
    let dataFilter = await Phone.find({ price: { $gte: minPrice, $lte: maxPrice } })
      .sort({ price: 1 })
      .limit(size)
      .skip((page - 1) * size)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .exec();


    // tổng số colection tìm được trong khoảng đó
    const count = await Phone.find({ price: { $gte: minPrice, $lte: maxPrice } })
      .countDocuments();


    res.status(200).json({
      message: 'Filter sản phẩm trong khoảng giá thành công',
      size,
      currentPage: page,
      totalPages: Math.ceil(count / size),
      "page/pages": `${page}/${Math.ceil(count / size)}`, // trang hiện tại /trên tổng số trang
      data: dataFilter
    })
    print('Filter sản phẩm trong khoảng giá thành công', outputType.SUCCESS);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm trong khoảng giá thất bại, Vui lòng thử lại !',
    })
    print(error, outputType.ERROR);
  }

}

// filter sản phẩm khi RAM bằng bao nhiêu đó
const filterPhoneRAM = async (req, res) => {
  try {

    let { page = 1, size = MAX_RECORDS } = req?.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;
    let { Ram } = req?.body;

    size = Number.parseInt(size);
    page = Number.parseInt(page);
    Ram.trim();



    // filter phone trong theo RAM
    let dataFilter = await Phone.find({ RAM: Ram })
      .sort({ price: 1 })
      .limit(size)
      .skip((page - 1) * size)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .exec();


    // tổng số colection tìm được khi RAM BẰNG điều kiện
    const count = await Phone.find({ RAM: Ram })
      .countDocuments();


    res.status(200).json({
      message: 'Filter sản theo RAM thành công',
      size,
      currentPage: page,
      totalPages: Math.ceil(count / size),
      "page/pages": `${page}/${Math.ceil(count / size)}`, // trang hiện tại /trên tổng số trang
      data: dataFilter
    })
    print('Filter sản theo RAM thành công', outputType.SUCCESS);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm theo RAM thất bại, Vui lòng thử lại !',
    })
    print(error, outputType.ERROR);
  }

}

// filter sản phẩm khi ROM bằng bao nhiêu đó
const filterPhoneROM = async (req, res) => {
  try {

    let { page = 1, size = MAX_RECORDS } = req?.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;
    let { Rom } = req?.body;
    console.log({ Rom })

    size = Number.parseInt(size);
    page = Number.parseInt(page);
    Rom.trim();



    // filter phone trong theo ROM
    let dataFilter = await Phone.find({ ROM: Rom })
      .sort({ price: 1 })
      .limit(size)
      .skip((page - 1) * size)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .exec();


    // tổng số colection tìm được khi ROM BẰNG điều kiện
    const count = await Phone.find({ ROM: Rom })
      .countDocuments();


    res.status(200).json({
      message: 'Filter sản theo ROM thành công',
      size,
      currentPage: page,
      totalPages: Math.ceil(count / size),
      "page/pages": `${page}/${Math.ceil(count / size)}`, // trang hiện tại /trên tổng số trang
      data: dataFilter
    })
    print('Filter sản theo ROM thành công', outputType.SUCCESS);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm theo ROM thất bại, Vui lòng thử lại !',
    })
    print(error, outputType.ERROR);
  }

}

// filter sản phẩm trong khoảng Kích Thước màn hình nào đó
const filterPhoneKichThuocManHinh = async (req, res) => {
  try {

    let { page = 1, size = MAX_RECORDS } = req?.query;
    size = size >= MAX_RECORDS ? MAX_RECORDS : size;
    let { minKichThuoc, maxKichThuoc } = req?.body;

    size = Number.parseInt(size);
    page = Number.parseInt(page);
    minKichThuoc = Number.parseFloat(minKichThuoc);
    maxKichThuoc = Number.parseFloat(maxKichThuoc);



    // filter phone trong khoảng kích thước màn hình nào đó 
    let dataFilter = await Phone.find({ kich_thuoc_man_hinh: { $gte: minKichThuoc, $lte: maxKichThuoc } })
      .sort({ price: 1 })
      .limit(size)
      .skip((page - 1) * size)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt')
      .exec();


    // tổng số colection tìm được trong khoảng đó
    const count = await Phone.find({ kich_thuoc_man_hinh: { $gte: minKichThuoc, $lte: maxKichThuoc } })
      .countDocuments();


    res.status(200).json({
      message: 'Filter sản phẩm trong khoảng Kích thước màn hình =>  thành công',
      size,
      currentPage: page,
      totalPages: Math.ceil(count / size),
      "page/pages": `${page}/${Math.ceil(count / size)}`, // trang hiện tại /trên tổng số trang
      data: dataFilter
    })
    print('Filter sản phẩm trong khoảng Kích thước màn hình thành công', outputType.SUCCESS);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm trong khoảng kích thước màn hình thất bại, Vui lòng thử lại !',
    })
    print(error, outputType.ERROR);
  }

}


const saveUrlImagePhone = async (req, res) => {
  // post
  const post = process.env.POST || 8081;
  // địa chỉ server => mặc định sẽ là locallhost nếu chưa có host thật
  const serverAddress = `${process.env.SERVER_ADDRESS}:${post}`; //   http://localhost:${post}

  // console.log('addressServer:', process.env.SERVER_ADDRESS)

  try {

    // console.log('req.files', req.files)
    // Xử lý tải lên nhiều ảnh
    // Xử lý tải lên tệp ảnh và lưu chúng vào thư mục lưu trữ
    // console.log('fileUpload:', req.files)

    const uploadedImages = req.files.map((file) => {
      // const imageUrl = `/uploads/${file.filename}`;
      // const imageUrl = `http://${os.hostname()}:${post}/uploads/${file.filename}`;
      const imageUrl = `${serverAddress}/uploads/${file.filename}`;
      // const imageUrl = `http://192.168.14.6:${post}/uploads/${file.filename}`;
      return imageUrl;
    });

    console.log({ uploadedImages });
    res.status(200).json({
      message: 'lưu url hình ảnh thành công',
      data: uploadedImages

    });

    print('lưu url hình ảnh thành công', outputType.SUCCESS);

  } catch (error) {
    res.status(500).json({
      message: 'lưu url hình ảnh thất bại !',
    })
    print(error, outputType.ERROR);
  }

}



export default { insertPhone, updatePhone, deletePhone, deleteManyPhone, getPhoneBuyID, getAllPhone, getAllPhoneNoPagination, searchPhone, sortPhonePrice, sortPhonePrice_Asc, filterPhonePrice, filterPhoneRAM, filterPhoneROM, filterPhoneKichThuocManHinh, saveUrlImagePhone, updatePhoneMany }