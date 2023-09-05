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


// update review 
const updateReview = async (req, res) => {
  try {
    await reviewResponsitorie.updateReview(req?.body, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `Update review thất bại !, Vui lòng thử lại`,
    })
  }

}

// DELETE review 
const deleteReview = async (req, res) => {
  try {
    await reviewResponsitorie.deleteReview(req, res);

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: `DELETE review thất bại !, Vui lòng thử lại`,
    })
  }

}


export default {
  insertReview,
  updateReview,
  deleteReview
}

