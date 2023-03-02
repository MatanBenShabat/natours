const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      required: [true, 'Review can not be empty!'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour!'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have an author!'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const [stats] = await this.aggregate([
    { $match: { tour: tourId } },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: {
          $avg: '$rating',
        },
      },
    },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats?.nRating || 0,
    ratingsAverage: stats?.avgRating || 4.5,
  });
};

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.currDoc = await this.findOne();
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  if (this.currDoc) {
    await this.currDoc.constructor.calcAverageRatings(this.currDoc.tour);
  }
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
