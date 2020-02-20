class APIfeatures {
  constructor(query, queryString) {
    this.query = query; //quuery from mongoose
    this.queryString = queryString; //query from client requisition
  }

  filter() {
    //FILTERING
    const queryObj = { ...this.queryString }; //copy into a new Object
    const excludedFields = ['page', 'fields', 'limit', 'sort'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      //se tiver na requisição do cliente sort
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const newFields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(newFields);
    } else {
      this.query = this.query.select('-__v'); //minus exclude instead include
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIfeatures;
