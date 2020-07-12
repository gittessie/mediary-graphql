const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    rating: {
      type: Number,
      required: true,
    },
    reviewText: {
      type: String,
    },
    movie: {
      type: Schema.Types.ObjectId,
      ref: "Movie",
    },
    reviewer: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
