import { orderResponsitorie } from "../respositories/index.js";
import { MAX_RECORDS } from '../Global/constants.js';
import { print, outputType } from "../helpers/print.js";


// insert đơn hàng
const insertOrder = async (req, res) => {
  try {
    await orderResponsitorie.insertOrder(req?.body, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `thêm Đơn Hàng THẤT BẠI !, Vui lòng thử lại`,
    })
  }

}


// Update đơn hàng
const updateOrder = async (req, res) => {
  try {
    await orderResponsitorie.updateOrder(req?.body, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Update đơn hàng thất bại !, Vui lòng thử lại`,
    })
  }

}


// DELETE 1 đơn hàng
const deleteOrder = async (req, res) => {
  try {
    await orderResponsitorie.deleteOrder(req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `DELETE đơn hàng thất bại !, Vui lòng thử lại`,
    })
  }

}


// DELETE nhiều đơn hàng  => admin mới có quyền xóa này
const deleteOrderMany = async (req, res) => {
  try {
    await orderResponsitorie.deleteManyOrder(req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `DELETE nhiều đơn hàng thất bại !, Vui lòng thử lại`,
    })
  }

}


// GET danh sách đơn hàng  => admin mới có quyền xóa này
const getListOrder = async (req, res) => {
  try {
    await orderResponsitorie.getListOrder(req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `GET danh sách đơn hàng thất bại !, Vui lòng thử lại`,
    })
  }

}


//SORT danh sách đơn hàng => theo DATE gần đây nhất => admin mới có quyền xóa này
const getListOrderSortDate = async (req, res) => {
  try {
    await orderResponsitorie.getListOrderSortDate(req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `SORT đơn hàng theo date thành công !, Vui lòng thử lại`,
    })
  }

}


//Tìm đơn hàng theo Status=> and SORT theo DATE gần đây nhất => admin mới có quyền xóa này
const getOrderByStatus = async (req, res) => {
  try {
    await orderResponsitorie.getOrderByStatus(req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Tìm đơn hàng theo STATUS thất bại !, Vui lòng thử lại`,
    })
  }

}

//Tìm đơn hàng theo ID
const getOrderByID = async (req, res) => {
  try {
    await orderResponsitorie.getOrderByID(req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Tìm đơn hàng theo ID thất bại !, Vui lòng thử lại`,
    })
  }

}

export default {
  insertOrder,
  updateOrder,
  deleteOrder,
  deleteOrderMany,
  getListOrder,
  getListOrderSortDate,
  getOrderByStatus,
  getOrderByID
}

