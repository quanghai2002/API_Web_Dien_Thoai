import { MAX_RECORDS } from "../Global/constants.js";
import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
// import { Student } from "../models/index.js";
import { Phone } from '../models/index.js';
import { faker } from '@faker-js/faker/locale/vi';


// get all phone and pagination
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
const getPhoneBuyID = async (phoneId, res) => {
  try {

    const phoneOne = await Phone.findById(phoneId)
      .populate('category', '-_id -products -createdAt -updatedAt')
      .populate('brand', '-_id -products -createdAt -updatedAt');
    // nếu tìm thấy sản phẩm theo id => cung cấp return fontend
    if (phoneOne) {
      res.status(200).json({
        message: 'Lấy 1 sản phẩm theo ID thành công !',
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
const insertPhone = async ({ name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion, category, brand }, res) => {

  try {
    print('thêm sản phẩm thành công', outputType.SUCCESS);

    const phone = await Phone.create({ name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion, category, brand });

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


// update phone
const updatePhone = async ({ _id, name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion }, res) => {
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
      message: `update students failed, cập nhật sản phẩm thất bại, thử lại id `,
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

// generate fake  => 1000 students => fake
// async function generateFakeStudent() {
//   [...Array(100).keys()].forEach(async (items) => {

//     let fakeStudents = {
//       name: faker.person.fullName(),
//       email: faker.internet.email(),
//       languages: faker.helpers.arrayElement(['Vietnamese', 'English', 'China', 'Nga']),
//       gender: faker.helpers.arrayElement(["Nam", "Nữ"]),
//       phoneNumber: faker.phone.number(),
//       address: faker.location.cityName(),

//     }
//     await Student.create(fakeStudents);
//     print(`Insert student name fake:${fakeStudents.name} - ${fakeStudents.phoneNumber}`);

//   })

// }



// export default { getAllStudents, insertStudents, generateFakeStudent, getStudentBuyID, updateStudent, deleteStudent, sortStudent, searchStudent }

export default { insertPhone, updatePhone, deletePhone, deleteManyPhone, getPhoneBuyID, getAllPhone, searchPhone, sortPhonePrice, sortPhonePrice_Asc, filterPhonePrice, filterPhoneRAM, filterPhoneROM, filterPhoneKichThuocManHinh }
