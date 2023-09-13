
// import { studentResponsitorie } from "../respositories/index.js";
import { phoneResponsitorie } from "../respositories/index.js";
import { MAX_RECORDS } from '../Global/constants.js';
import { print, outputType } from "../helpers/print.js";

// get all Phone and pagination
const getAllPhone = async (req, res) => {
  // pagination  => phân trang
  //http://.../phone?page=1&size=60

  let { page = 1, size = MAX_RECORDS } = req?.query;

  size = size >= MAX_RECORDS ? MAX_RECORDS : size;

  try {

    await phoneResponsitorie.getAllPhone({
      size,
      page,
    }, res)

  } catch (error) {
    res.status(500).json({
      message: 'wrong all students failed !',
    })
    print(error, outputType.ERROR);

  }

}

// get all Phone ko phân trang => lấy tất cả sản phẩm
const getAllPhoneNoPagination = async (req, res) => {
  // pagination  => phân trang
  //http://.../phone?page=1&size=60

  try {

    await phoneResponsitorie.getAllPhoneNoPagination(req, res)

  } catch (error) {
    res.status(500).json({
      message: 'wrong all không có phân trang => thất bại => students failed !',
    })
    print(error, outputType.ERROR);

  }

}


// search Phone => tìm kiếm sản phẩm => theo tên sản phẩm
const searchPhone = async (req, res) => {

  //localhost:8080/api/phone/search?name=hai
  try {
    let searchName = '';
    // nếu có từ khóa tìm kiếm => lấy giá trị tìm kiếm theo từ khóa đó
    if (req.query?.name) {
      searchName = req.query?.name
    }
    ///

    //localhost:8080/api/phone/search?name=hai&page=1
    // nếu có page => lấy page
    let page = 1;
    if (req.query?.page) {
      page = req.query?.page
    }

    // giới hạn tìm thấy là 16
    const limit = 16;

    // get data khop tu khoa search
    // tìm dữ liệu khớp với từ khóa search

    let { resultSearch, count } = await phoneResponsitorie.searchPhone({ searchName, page, limit })

    // data return ve API
    const result = {
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      "page/pages": `${page}/${Math.ceil(count / limit)}`, // trang hiện tại /trên tổng số trang
      searchString: searchName,
      data: resultSearch
    }

    // 
    res.status(200).json({
      message: 'Search Phone successfully, tìm kiếm thành công',
      data: result
    })
    print('Search Phone successfully', outputType.SUCCESS);

  } catch (error) {
    res.status(500).json({
      message: 'SEARCH phone failed !, tìm kiếm sản phẩm theo tên thất bại',
    })
    print(error, outputType.ERROR);
  }

}



// sort and pagination Phone => theo giá sản phẩm từ CAO đến THẤP
const sortPhonePrice = async (req, res) => {

  let { page = 1, size = MAX_RECORDS } = req?.query;
  size = size >= MAX_RECORDS ? MAX_RECORDS : size;

  try {
    let { sortPhonePrice, count } = await phoneResponsitorie.sortPhonePrice({
      size,
      page
    })

    res.status(200).json({
      message: 'sắp xếp Phone => theo giá sản phẩm => Từ cao đến Thấp => thành công',
      size,
      page,
      pages: Math.ceil(count / size), // tổng số các page
      "page/pages": `${page}/${Math.ceil(count / size)}`, // trang hiện tại => trên tổng số trang
      sort: 'asc-NameStudent',
      data: sortPhonePrice
    })
    print('Sort phone theo giá sản phẩm thành công', outputType.SUCCESS);


  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sort Phone theo giá sản phẩm thất bại',
    })
    print(error, outputType.ERROR);
  }

}

// sort and pagination Phone => theo giá sản phẩm từ THẤP => CAO
const sortPhonePrice_Asc = async (req, res) => {

  let { page = 1, size = MAX_RECORDS } = req?.query;
  size = size >= MAX_RECORDS ? MAX_RECORDS : size;

  try {
    let { sortPhonePrice, count } = await phoneResponsitorie.sortPhonePrice_Asc({
      size,
      page
    })

    res.status(200).json({
      message: 'sắp xếp Phone => theo giá sản phẩm => Từ THẤP đến CAO => thành công',
      size,
      page,
      pages: Math.ceil(count / size), // tổng số các page
      "page/pages": `${page}/${Math.ceil(count / size)}`, // trang hiện tại => trên tổng số trang
      sort: 'asc-NameStudent',
      data: sortPhonePrice
    })
    print('Sort phone theo giá sản phẩm từ Thấp => Cao thành công', outputType.SUCCESS);


  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Sort Phone theo giá sản phẩm thất bại',
    })
    print(error, outputType.ERROR);
  }

}

// get 1 sản phẩm theo ID 
const getPhoneBuyID = async (req, res) => {

  let phoneId = req?.params?.id;


  try {
    await phoneResponsitorie.getPhoneBuyID(phoneId, req, res);

  } catch (error) {
    res.status(500).json({
      message: 'wrong failed student Buy ID !',
    })
    print(error, outputType.ERROR);
  }
}


// update phone => theo id
const updatePhone = async (req, res) => {

  const { _id, name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion } = req.body;

  try {

    await phoneResponsitorie.updatePhone({ _id, name, description, price, dung_luong_pin, mau_sac, bo_nho, kich_thuoc_man_hinh, camera, CPU, RAM, ROM, he_dieu_hanh, stock_quantity, image_urls, promotion }, res);

  } catch (error) {
    res.status(500).json({
      message: `Cập nhật sản phẩm thất bại !, vui lòng thử lại`,
    })
  }

}

// insert student
const insertPhone = async (req, res) => {
  try {
    await phoneResponsitorie.insertPhone(req?.body, res);

  } catch (error) {
    res.status(500).json({
      message: `Thêm sản phẩm thất bại !, Vui lòng thử lại`,
    })
  }

}


// delete one phone buy ID
const deletePhone = async (req, res) => {
  let phoneId = req.params?.idDelete;

  try {
    await phoneResponsitorie.deletePhone(phoneId, res);

  } catch (error) {
    res.status(500).json({
      message: 'wrong DELETE student Buy ID !, xóa 1 sản phẩm thất bại',
    })
    print(error, outputType.ERROR);
  }
}


// delete nhiều products theo danh sách buy ID
const deleteManyPhone = async (req, res) => {

  try {
    await phoneResponsitorie.deleteManyPhone(req, res);

  } catch (error) {
    res.status(500).json({
      message: 'xóa nhiều sản phẩm thất bại ! Thử lại',
    })
    print(error, outputType.ERROR);
  }
}

// get phone price trong khoảng giá được nhập vào
const getPhonePrice_KhoangAB = async (req, res) => {

  try {
    await phoneResponsitorie.filterPhonePrice(req, res);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm trong khoảng giá thất bại',
    })
    print(error, outputType.ERROR);
  }
}


// get phone khi RAM bằng bao nhiêu đó
const getPhoneRAM = async (req, res) => {

  try {
    await phoneResponsitorie.filterPhoneRAM(req, res);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm theo RAM thất bại',
    })
    print(error, outputType.ERROR);
  }
}

// get phone khi RAM bằng bao nhiêu đó
const getPhoneROM = async (req, res) => {

  try {
    await phoneResponsitorie.filterPhoneROM(req, res);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm theo ROM thất bại',
    })
    print(error, outputType.ERROR);
  }
}

// get phone price trong khoảng KÍCH THƯỚC MÀN HÌNH được nhập vào
const getPhoneKichThuocManHinh = async (req, res) => {

  try {
    await phoneResponsitorie.filterPhoneKichThuocManHinh(req, res);

  } catch (error) {
    res.status(500).json({
      message: 'Filter sản phẩm trong khoảng Kích thước màn hình thất bại, Thử lại !',
    })
    print(error, outputType.ERROR);
  }
}

// lưu ảnh và trả về url hình ảnh
const saveUrlImagePhone = async (req, res) => {

  try {
    await phoneResponsitorie.saveUrlImagePhone(req, res);

  } catch (error) {
    res.status(500).json({
      message: 'Lưu url hình ảnh thất bại',
    })
    print(error, outputType.ERROR);
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

  insertPhone,
  updatePhone,
  deletePhone,
  deleteManyPhone,
  getPhoneBuyID,
  getAllPhone,
  getAllPhoneNoPagination,
  searchPhone,
  sortPhonePrice,
  sortPhonePrice_Asc,
  getPhonePrice_KhoangAB,
  getPhoneRAM,
  getPhoneROM,
  getPhoneKichThuocManHinh,
  saveUrlImagePhone


  // generateFakeStudent // có thể xóa => fake data
}

