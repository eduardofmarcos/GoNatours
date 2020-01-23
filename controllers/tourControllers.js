const Tour = require('./../models/tourModel');
const APIFeatures = require('./utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage, price';
  req.query.fields = 'name, price, ratingsAverage, difficulty';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Impossible to get the data',
      err: err
    });
  }
};

exports.getSingleTour = async (req, res) => {
  try {
    const singleTour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: {
        singleTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: 'Cannot find ID',
      err: err
    });
  }
};

exports.createSingleTour = async (req, res) => {
  try {
    // const newTour = new Tour()
    // newTour.save({dados})

    const newTour = await Tour.create(req.body);
    res.status(201).send({
      status: 'success',
      data: {
        tours: newTour
      }
    }); //201 status means created
  } catch (err) {
    res.status(400).json({
      status: 'faillll right now',
      error: err
    });
  }
};

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

exports.updateTour = async (req, res) => {
  try {
    const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour: updatedTour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Not Updated',
      err: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      //204 - means delete, no content
      status: 'success',
      data: {
        message: 'null'
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'failed',
      message: 'Not Updated',
      err: err
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(404).json({
      status: 'failed',
      message: 'Impossible to get the data',
      err: error
    });
  }
};

exports.getMonthPlan = async (req, res) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};
