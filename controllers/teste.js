class APIfeatures {
  constructor(mongoQuery, clientQuery) {
    (this.mongoQuery = mongoQuery), (this.clientQuery = clientQuery);
  }

  filter() {
    let queryClient = { ...this.queryClient }; //copy into a new Object
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
    this.mongoQuery = Tour.find(queryClient);
  }
}
