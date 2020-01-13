const Tour = require('./../models/tourModel');

exports.getAllTours = async (req, res) => {
  try {
    /****build the query****/
    //1) - filtering
    let queryClient = { ...req.query }; //copy into a new Object
    const excludeFields = ['page', 'fields', 'limit', 'sort'];

    excludeFields.forEach(el => {
      if (el in queryClient) {
        delete queryClient[el];
      }
    });

    //2) - advanced filtering
    let stringQuery = JSON.stringify(queryClient);

    stringQuery = stringQuery.replace(
      /\b(gte|gt|lte|lt)\b/g,
      match => `$${match}`
    );
    queryClient = JSON.parse(stringQuery);

    //3) - sorting - Ordenando
    let queryFromMongoose = Tour.find(queryClient); // retorna uma querie(um objeto"promise" do mongoose). Para achar, usamos a requisiçao do cliente

    if (req.query.sort) {
      let newReqQuery;
      //se tiver na requisição do cliente sort
      if (req.query.sort.includes(',')) {
        newReqQuery = req.query.sort.replace(/,/g, ' ');
        queryFromMongoose = queryFromMongoose.sort(newReqQuery);
      }
      queryFromMongoose = queryFromMongoose.sort(req.query.sort); // conseguimos usar esse outro metodo justamente por, estarmos trabalhando com uma querie encadenada, e o sort, retorna outra querie
    } else {
      queryFromMongoose.sort('-createdAt');
    }

    // 4) field limits
    if (req.query.fields) {
      const newFields = req.query.fields.split(',').join(' ');
      queryFromMongoose = queryFromMongoose.select(newFields);
    } else {
      queryFromMongoose = queryFromMongoose.select('-__v'); //minus exclude instead include
    }

    /****execute the query****/
    const allTours = await queryFromMongoose; //entramos com uma querie no await, para pegarmos os resultados, e ele retorna outra querie/promise com resolve ou reject

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
