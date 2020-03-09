const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('There is no document with this ID', 404));
    }

    res.status(204).json({
      //204 - means delete, no content
      status: 'success',
      data: {
        message: 'null'
      }
    });
  });

exports.updateOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!doc) {
      return next(new AppError('There is no document with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.createOne = model =>
  catchAsync(async (req, res, next) => {
    const doc = await model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getOne = (model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = model.findById(req.params.id);

    if (query.populate) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('There is no document with this ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc
      }
    });
  });

exports.getAll = model =>
  catchAsync(async (req, res, next) => {
    //to allow to GET nested routees review on tour
    let filter = {};

    if (req.params.tourId) filter = { tour: req.params.tourId };
    const features = new APIFeatures(model.find(filter), req.query) //this is where the querie from mongoose comes//
      .filter()
      .sort()
      .limitFields()
      .paginate();

    //console.log(features.query);
    const allDocs = await features.query; //entramos com uma querie no await, para pegarmos os resultados, e ele retorna outra querie/promise com resolve ou reject

    /****responses****/

    res.status(200).json({
      status: 'success',
      timeAt: req.time,
      results: allDocs.length,
      data: {
        data: allDocs
      }
    });
  });
