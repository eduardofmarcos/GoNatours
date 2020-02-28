const mongoose = require('mongoose');
const slugify = require('slugify');
//const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have a max length of 40 characters'],
      minlength: [10, 'A tour name must have a min length of 10 characters']
      //alidate: [validator.isAlpha, 'A tour name must be only alpha']
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A tour must be above 1.0'],
      max: [5, 'A tour must be below 5.0']
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      trim: true,
      enum: {
        values: ['easy', 'medium', 'difficulty'],
        message: 'A tour must be only, easy, medium or difficulty'
      }
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          //the this keyword only works when creating a document
          return val < this.price;
        },
        message: 'The discount price ({VALUE}) must be low than the price'
      }
    },
    summary: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      required: [true, 'A tour must have a description'],
      trim: true
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: [Date],
    secretTours: {
      type: Boolean,
      default: false
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

//Document Middleware: runs before the save() and the create()

tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre('save', function(next) {
  console.log('Saving the document...');
  next();
});

tourSchema.post('save', function(doc, next) {
  console.log(doc);
  next();
});

//query middleware
//return a querie object so we can chain the others methods
tourSchema.pre(/^find/, function(next) {
  this.find({ secretTours: { $ne: true } });

  this.start = new Date();
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  //console.log(`It tooks ${new Date() - this.start} miliseconds`);
  //console.log(docs);
  next();
});

//agreggation middleware

tourSchema.pre('aggregate', function(next) {
  this.pipeline().unshift({
    $match: {
      secretTours: { $ne: true }
    }
  });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
