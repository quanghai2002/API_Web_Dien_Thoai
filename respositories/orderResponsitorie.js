import { MAX_RECORDS } from "../Global/constants.js";
import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
// import { Student } from "../models/index.js";
import { orderSchema } from '../models/index.js';
// import { faker } from '@faker-js/faker/locale/vi';



// insert đơn hàng 
const insertOrder = async ({ status, total_price, shipping_address, payment_method, user, products, products2 }, res) => {

  try {

    const order = await orderSchema.create({ status, total_price, shipping_address, payment_method, user, products, products2 });
    print('thêm MỚI ĐƠN HÀNG  =>  Thành Công', outputType.SUCCESS);
    res.status(200).json({
      message: 'Thêm mới đơn hàng thành công',
      data: order,
    })

  } catch (error) {
    print(error, outputType.ERROR)
    console.log(error)
    // error from validation
    res.status(500).json({
      message: ` KHÔNG thêm được đơn hàng, vui lòng thử lại! `,
    })

  }
};


// insert many đơn hàng => insert nhiều đơn hàng 1 lúc 
const insertManyOrder = async (req, res) => {
  const { orders } = req?.body;
  try {
    const createdOrders = await orderSchema.insertMany(orders);
    res.status(200).json({
      message: 'Thêm NHIỀU ĐƠN HÀNG THÀNH CÔNG',
      data: createdOrders,
    })

  } catch (error) {
    print(error, outputType.ERROR)
    console.log(error)
    // error from validation
    res.status(500).json({
      message: ` KHÔNG thêm được NHIỀU đơn hàng, vui lòng thử lại! `,
    })

  }
};


// sửa đơn hàng 
const updateOrder = async ({ _id, status, total_price, shipping_address, payment_method, user, products, products2 }, res) => {

  try {

    const orderUpdate = await orderSchema.findById(_id);

    orderUpdate.status = status ?? orderUpdate.status; // ?? null,undefined lay gia tri thu 2
    orderUpdate.total_price = total_price ?? orderUpdate.total_price; // ?? null,undefined lay gia tri thu 2
    orderUpdate.shipping_address = shipping_address ?? orderUpdate.shipping_address; // ?? null,undefined lay gia tri thu 2
    orderUpdate.payment_method = payment_method ?? orderUpdate.payment_method; // ?? null,undefined lay gia tri thu 2
    orderUpdate.user = user ?? orderUpdate.user; // ?? null,undefined lay gia tri thu 2
    orderUpdate.products = products ?? orderUpdate.products; // ?? null,undefined lay gia tri thu 2
    orderUpdate.products2 = products2 ?? orderUpdate.products2; // ?? null,undefined lay gia tri thu 2

    await orderUpdate.save();

    print('Cập nhật đơn hàng  =>  Thành Công', outputType.SUCCESS);
    res.status(200).json({
      message: 'Cập nhật đơn hàng thành công !',
      data: orderUpdate,
    })

  } catch (error) {
    print(error, outputType.ERROR)
    console.log(error)
    // error from validation
    res.status(500).json({
      message: ` KHÔNG sửa được đơn hàng, vui lòng thử lại!,Đơn hàng không tồn tại `,
    })

  }
};

// UPDATE MANY ĐƠN HÀNG 
const updateOrderMany = async (req, res) => {

  try {
    const orderUpdates = req?.body; // Đây là danh sách các sản phẩm cần cập nhật
    // console.log('thông tin các đơn hàng cần cập nhật là:', orderUpdates);
    const updatedProducts = [];

    for (const update of orderUpdates) {
      const productId = update?._id;
      const newStatus = update?.status;

      // Tạo điều kiện cập nhật chon đơn hàng
      const updateCondition = { _id: productId };

      // Tạo đối tượng chứa trường cần cập nhật và giá trị mới
      const updateFields = {
        $set: {
          status: newStatus,
        },
      };
      // Sử dụng updateOne để cập nhật đơn hàng cụ thể
      const result = await orderSchema.updateOne(updateCondition, updateFields);

      if (result?.matchedCount > 0) {
        // Nếu sản phẩm đã được cập nhật thành công, thêm nó vào danh sách updatedProducts
        updatedProducts.push(productId);
      }
    };

    // Lấy thông tin các đơn hàng đã cập nhật thành công
    const updateOrderDetails = await orderSchema.find({ _id: { $in: updatedProducts } });

    print('Cập nhật nhiều ĐƠN HÀNG thành công', outputType.SUCCESS);
    res.status(200).json({
      message: 'CẬP NHẬT NHIỀU ĐƠN HÀNG THÀNH CÔNG',
      data: updateOrderDetails,
    });

  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: `CẬP NHẬT NHIỀU ĐƠN HÀNG THẤT BẠI`,
    })
  }

};

//  xóa đơn hàng
const deleteOrder = async (req, res) => {

  try {

    let orderId = req?.params?.idDelete;
    console.log("id xóa đơn hàng:", orderId);

    const countDeleteOrder = await orderSchema.findByIdAndDelete(orderId);

    print('Xóa đơn hàng  =>  Thành Công', outputType.SUCCESS);
    res.status(200).json({
      message: 'Xóa đơn hàng thành công !',
      data: countDeleteOrder,
    })

  } catch (error) {
    print(error, outputType.ERROR)
    console.log(error)
    // error from validation
    res.status(500).json({
      message: ` KHÔNG xóa được đơn hàng, vui lòng thử lại! `,
    })

  }
};

// delete nhiều đơn hàng => phone buy  => list ID
const deleteManyOrder = async (req, res) => {

  const { idsListDelete } = req?.body;
  console.log({ idsListDelete });

  try {
    let deleteOrderMany = await orderSchema.deleteMany({ _id: { $in: idsListDelete } })
    res.status(200).json({
      message: 'Xóa nhiều đơn hàng => thành công',
      deleteOrderMany

    })
    print('Xóa nhiều đơn hàng => thành công.', outputType.SUCCESS);

  } catch (error) {
    print('Xóa nhiều đơn hàng thất bại ! Vui lòng thử lại', outputType.ERROR);

    res.status(200).json({
      message: 'Xóa nhiều đơn hàng thất bại, nhập đúng id đơn hàng  ! Vui lòng thử lại',

    })
  }
}

// get DANH SÁCH ĐƠN HÀNG and panination cá sản phẩm bên trong
const getListOrder = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const size = parseInt(req.query.size) || 3 // default size mặc định cho các sản phẩm là 3

  try {
    print('GET Danh sách ĐƠN HÀNG thành công', outputType.SUCCESS);

    const category = await orderSchema.find()

      //  .limit(size)
      // .skip((page - 1) * size)
      .skip((page - 1) * size)
      .limit(size)
      .populate('user')
      // .populate({
      //   path: 'products',
      //   model: 'Product',
      // })  không cần đến nữa vì đã lưu trực tiếp 1 sản phẩm vào trong products rồi
      .exec();


    // tổng số bản ghi của order thỏa mãn điều kiện
    const countOrder = await orderSchema.find()
      .populate('user')
      // .populate('products')
      .exec();

    // phân trang đơn hàng  
    res.status(200).json({
      message: 'GET Danh sách đơn hàng => thành công',
      currentPage: page,
      size,
      totalPages: Math.ceil(countOrder.length / size),
      "page/pages": `${page}/${Math.ceil(countOrder.length / size)}`, // trang hiện tại /trên tổng số trang
      data: category,
    })


  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` không GET được danh sách đơn hàng, vui lòng thử lại! `,
    })

  }
}

// LẤY TẤT CẢ ĐƠN HÀNG => KHÔNG CÓ PHÂN TRANG
const getAllOrderNoPagination = async (req, res) => {

  try {
    const categoryAll = await orderSchema.find()
      .populate('user')
      .exec();

    print('LẤY TẤT CẢ ĐƠN HÀNG => KHÔNG PHÂN TRANG => THÀNH CÔNG', outputType.SUCCESS);
    // KHÔNG CẦN PHÂN TRANG ĐƠN HÀNG 
    res.status(200).json({
      message: 'GET TẤT CẢ ĐƠN HÀNG => KHÔNG PHÂN TRANG => thành công',
      data: categoryAll,
    })
  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` LẤY TẤT CẢ ĐƠN HÀNG => KHÔNG PHÂN TRANG THẤT BẠI =>, vui lòng thử lại! `,
    })
  }
}

// SORT đơn hàng THEO Thời gian gần đây 
const getListOrderSortDate = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const size = parseInt(req.query.size) || 3 // default size mặc định cho các sản phẩm là 3

  try {
    print('Sắp xếp đơn hàng theo DATE thành công', outputType.SUCCESS);

    const category = await orderSchema.find()

      //  .limit(size)
      // .skip((page - 1) * size)
      .sort({ order_date: -1 })  // sắp xếp theo thời gian gần đây nhất
      .skip((page - 1) * size)
      .limit(size)
      .populate('user')
      // .populate({
      //   path: 'products',
      //   model: 'Product',
      // })
      .exec();


    // tổng số bản ghi của order thỏa mãn điều kiện
    const countOrder = await orderSchema.find()
      .sort({ order_date: -1 })
      .populate('user')
      // .populate('products')
      .exec();

    // phân trang đơn hàng  
    res.status(200).json({
      message: 'Sắp xếp đơn hàng theo DATE => thành công',
      currentPage: page,
      size,
      totalPages: Math.ceil(countOrder.length / size),
      "page/pages": `${page}/${Math.ceil(countOrder.length / size)}`, // trang hiện tại /trên tổng số trang
      data: category,
    })


  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` Sắp xếp đơn hàng theo DATE thất bại, vui lòng thử lại! `,
    })

  }
}


// get Đơn hàng theo status Và SORT THEO Thời gian gần đây  
const getOrderByStatus = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Page number, default to 1
  const size = parseInt(req.query.size) || 3 // default size mặc định cho các sản phẩm là 3

  const { status } = req?.body;
  status.trim();

  console.log(status);

  try {
    print('Tìm đơn hàng theo STATUS thành công', outputType.SUCCESS);

    const category = await orderSchema.find({ status })
      .sort({ order_date: -1 })  // sắp xếp theo thời gian gần đây nhất
      .skip((page - 1) * size)
      .limit(size)
      .populate('user')
      // .populate({
      //   path: 'products',
      //   model: 'Product',
      // })
      .exec();


    // tổng số bản ghi của order thỏa mãn điều kiện
    const countOrder = await orderSchema.find({ status })
      .sort({ order_date: -1 })
      .populate('user')
      // .populate('products')
      .exec();

    // phân trang đơn hàng  
    res.status(200).json({
      message: 'Tìm đơn hàng theo STATUS  => thành công',
      currentPage: page,
      size,
      totalPages: Math.ceil(countOrder.length / size),
      "page/pages": `${page}/${Math.ceil(countOrder.length / size)}`, // trang hiện tại /trên tổng số trang
      data: category,
    })


  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` Tìm đơn hàng theo STATUS thất bại, vui lòng thử lại! `,
    })

  }
}

// get Đơn hàng theo id
const getOrderByID = async (req, res) => {

  let orderId = req?.params?.id;

  console.log({ orderId })
  try {
    print('Tìm đơn hàng theo ID thành công', outputType.SUCCESS);

    const category = await orderSchema.findById(orderId)

      .populate('user')
      // .populate({
      //   path: 'products',
      //   model: 'Product',
      // })
      .exec();


    res.status(200).json({
      message: 'Tìm đơn hàng theo ID  => thành công',
      data: category,
    })


  } catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` Tìm đơn hàng theo ID thất bại, nhập đúng ID đơn hàng, vui lòng thử lại! `,
    })

  }
}


export default { insertOrder, updateOrder, deleteOrder, deleteManyOrder, getListOrder, getListOrderSortDate, getOrderByStatus, getOrderByID, insertManyOrder, getAllOrderNoPagination, updateOrderMany }
