const mongoose = require('mongoose');
const Tour = require('./../models/tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty']
    },
    rating: {
      type: Number,
      min: [1, 'A review must have a minimum rating of 1'],
      max: [5, 'A review must have a maximum rating of 5']
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A review must have a tour!']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must have a user!']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function(next) {
  //   this.populate({
  //     path: 'tour',
  //     select: 'name'
  //   }).populate({
  //     path: 'user',
  //     select: 'name photo'
  //   });
  //   next();
  // });

  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

reviewSchema.statics.CalcAverageRatings = async function(tourId) {
  //console.log('passou aqui');
  //console.log(tourId);
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 0,
      ratingsQuantity: 4.5
    });
  }

  //console.log(stats);
};

reviewSchema.post('save', function() {
  //this point to the current review
  this.constructor.CalcAverageRatings(this.tour);
});

reviewSchema.pre(/^findOneAnd/, async function(next) {
  //impossivel to use as above because "this" point to query and not document
  this.r = await this.findOne(); //so we wait for save the document on database, find the document
  //console.log(this.r); //this in the line above means we are passing the data from 'pre' to 'post' middleware and then we can retrieve the review document from 'this' variable
  next();
});

reviewSchema.post(/^findOneAnd/, async function() {
  //console.log('passou aqui, second middleware');
  //await this.findOne() = we can not use here because the query is already executed!!
  await this.r.constructor.CalcAverageRatings(this.r.tour); // then here, we can use the method 'calculate..., because "this" are point now to document"r", and not to query
}); //query already executed

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
