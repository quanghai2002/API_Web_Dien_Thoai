import { MAX_RECORDS } from "../Global/constants.js";
import Exception from "../exceptions/Exception.js";
import { print, outputType } from "../helpers/print.js";
// import { Student } from "../models/index.js";
import { reviewSchema } from '../models/index.js';
// import { faker } from '@faker-js/faker/locale/vi';



// insert review
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


// update review
const updateReview = async ({ _id, rating, comment, timestamp, user, product }, res) => {
  try {
    const review = await reviewSchema.findById(_id);
    const timestamp = Date.now();

    review.rating = rating ?? review.rating; // ?? null,undefined lay gia tri thu 2
    review.comment = comment ?? review.comment; // ?? null,undefined lay gia tri thu 2
    review.timestamp = timestamp ?? review.timestamp; // ?? null,undefined lay gia tri thu 2
    review.user = user ?? review.user; // ?? null,undefined lay gia tri thu 2
    review.product = product ?? review.product; // ?? null,undefined lay gia tri thu 2


    await review.save();

    print('Cập nhật REVIEW thành công', outputType.SUCCESS);
    res.status(200).json({
      message: 'Cập nhật REVIEW thành công',
      data: review,
    })

  }
  catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` cập nhật REVIEW thất bại, thử lại id `,
    })

  }
}


// delete 1 review
const deleteReview = async (req, res) => {
  const reviewId = req.params?.idDelete;

  console.log({ reviewId });
  try {
    const countDeleteReview = await reviewSchema.findByIdAndDelete(reviewId);

    print('DELETE REVIEW thành công', outputType.SUCCESS);
    res.status(200).json({
      message: 'DELETE REVIEW thành công',
      countDeleteReview,
    })

  }
  catch (error) {
    print(error, outputType.ERROR)
    // error from validation
    res.status(500).json({
      message: ` DELETE REVIEW thất bại, thử lại id `,
    })

  }
}



export default { insertReview, updateReview, deleteReview }
