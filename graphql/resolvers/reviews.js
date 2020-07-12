const Review = require("../../mongoose/models/review");
const Movie = require("../../mongoose/models/movie");
const User = require("../../mongoose/models/user");

const userFromID = async (userID) => {
  try {
    const user = await User.findById(userID);
    return { ...user._doc };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const movieFromID = async (movieID) => {
  try {
    const movie = await Movie.findById(movieID);
    return { ...movie._doc };
  } catch (e) {
    console.log(e);
    throw e;
  }
};

const transformReview = (review) => {
  return {
    ...review._doc,
    reviewer: userFromID.bind(this, review._doc.reviewer),
    movie: movieFromID.bind(this, review._doc.movie),
    createdAt: new Date(review._doc.createdAt).toISOString(),
    updatedAt: new Date(review._doc.updatedAt).toISOString(),
  };
};

module.exports = {
  reviews: async (args, req) => {
    if(!req.isAuth){
      throw new Error('Not authorized.');
    }
    try {
      const reviews = await Review.find();
      return reviews.map((review) => transformReview(review));
    } catch (e) {
      console.log(e);
    }
  },
  reviewMovie: async ({ rating, reviewText, movieID }, req) => {
    if(!req.isAuth){
      throw new Error('Not authorized.');
    }
    try {
      const fetchedMovie = await Movie.findOne({ _id: movieID });
      if (!fetchedMovie) {
        throw new Error("Movie not found.");
      }
      const review = new Review({
        rating: rating,
        reviewText: reviewText,
        reviewer: req.userID,
        movie: fetchedMovie,
      });
      const result = await review.save();
      return transformReview(result);
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
  removeReview: async ({reviewID}, req) => {
    if(!req.isAuth){
      throw new Error('Not authorized.');
    }
    try {
      const fetchedReview = await Review.findOne({
        _id: reviewID,
      }).populate("movie").populate('user');
      const user = { ...fetchedReview.user._doc };
      if(user._id != req.userID){
        throw new Error('Not authorized.');
      }
      if (!fetchedReview) {
        throw new Error("Review not found.");
      }
      const movie = { ...fetchedReview.movie._doc };
      await Review.deleteOne({ _id: reviewID });
      return movie;
    } catch (e) {
      console.log(e);
      throw e;
    }
  },
};
