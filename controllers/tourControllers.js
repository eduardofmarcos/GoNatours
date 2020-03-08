const Tour = require('./../models/tourModel');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, difficulty';
  next();
};

exports.getAllTours = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(Tour.find(), req.query) //this is where the querie from mongoose comes//
    .filter()
    .sort()
    .limitFields()
    .paginate();

  //console.log(features.query);
  const allTours = await features.query; //entramos com uma querie no await, para pegarmos os resultados, e ele retorna outra querie/promise com resolve ou reject

  /****responses****/

  res.status(200).json({
    status: 'success',
    timeAt: req.time,
    results: allTours.length,
    data: {
      allTours
    }
  });
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
  const singleTour = await Tour.findById(req.params.id).populate('reviews');

  if (!singleTour) {
    return next(new AppError('There is no tour with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      singleTour
    }
  });
});

exports.createSingleTour = catchAsync(async (req, res, next) => {
  // const newTour = new Tour()
  // newTour.save({dados})

  const newTour = await Tour.create(req.body);
  res.status(201).send({
    status: 'success',
    data: {
      tours: newTour
    }
  }); //201 status means created
});

// exports.checkBody = (req, res, next) => {
//   const name = 'name';
//   const price = 'price';
//   const body = req.body;
//   if (name in body && price in body) {
//     next();
//   } else {
//     return res.status(400).json({
//       status: 'failed',
//       message: 'invalid properties'
//     });
//   }
// };

exports.updateTour = catchAsync(async (req, res, next) => {
  const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!updatedTour) {
    return next(new AppError('There is no tour with this ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour: updatedTour
    }
  });
});

exports.deleteTour = catchAsync(async (req, res, next) => {
  const tourToDelete = await Tour.findByIdAndDelete(req.params.id);

  if (!tourToDelete) {
    return next(new AppError('There is no tour with this ID', 404));
  }

  res.status(204).json({
    //204 - means delete, no content
    status: 'success',
    data: {
      message: 'null'
    }
  });
});

exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 3 } }
    },

    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRatings: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);
  console.log('ok');
  res.status(200).json({
    status: 'success',
    timeAt: req.time,
    data: {
      stats
    }
  });
});

exports.getMonthPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates'
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStart: { $sum: 1 },
        tour: { $push: '$name' }
      }
    },
    {
      $addFields: { month: '$_id' }
    },
    {
      $project: {
        _id: 0
      }
    },
    {
      $sort: {
        numTourStart: -1
      }
    }
  ]);

  res.status(200).json({
    status: 'success',
    message: {
      plan
    }
  });
});
