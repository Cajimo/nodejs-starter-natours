const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//!Schema (like an  jsclass) for mongoose
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      //VALIDATORS... works because "runValidators: true" on Update Controller when update docs.
      //Shorthand to set validators.
      maxlength: [40, 'El nombre del tour debe contener hasta 40 caracteres.'],
      minlength: [10, 'El nombre del tour debe contener más de 10 caracteres'],
      //VALIDATOR 3rd party... As an object with methods. Function just to be used.
      /* validate: [
        validator.isAlpha,
        'El nombre del tour solo debe contener carácteres',
      ], */
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'Un tour debe contener una duración'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'Un tour debe contener un tamaño de grupo'],
    },
    difficulty: {
      type: String,
      required: [true, 'Un tour debe contener una dificultad'],
      //VALIDATOR "enum" only for strings.
      //Normal way to set validators
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'La dificultad está entre: fácil, medio, difícil.',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      // VALIDATORS numbers... "min/max" for numbers and dates.
      min: [1, 'Rating debe ser arriba de 1.0'],
      max: [5, 'Rating debe ser debajo de 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
      //VALIDATORS: Custom validator.
      validate: {
        validator: function (val) {
          // this only points to current doc on NEW document creation.
          return val < this.price;
        },
        message:
          //({}) el precio se muestra gracias a mongoose
          'El descuento debería ser menor que el precio ({VALUE}) regular!',
      },
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image'],
    },
    images: [String],
    CreatedAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
//!Model (like an jsObject) from mongoose Schema

/**
 * Virtual property "durationWeeks"... no needs of save in DB
 * will be created each time that we get some data out of the DB.
 * On mongoose always use normal function because of "this" key that
 * be pointing to the current document.
 * Needs to be defined in the Schema options.
 */
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

/**
 * Mongoose MIDDLEWARES
 */

//DOCUMENT MIDDLEWARE: runs before .save() and .create() but not .insertMany()
// "next" works like express...
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

/* tourSchema.pre('save', function (next) {
  console.log('Will save document...');
  next();
}); */

// POST MIDDLEWARE executes after all the pre middleware functions have completed.
/* tourSchema.post('save', function (doc, next) {
  console.log(doc);
  next();
}); */

// QUERY MIDDLEWARE
//tourSchema.pre("find", function (next) {
tourSchema.pre(/^find/, function (next) {
  // The regular expression means, all the strings that starts with "find"
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`La consulta tomó ${Date.now() - this.start} milisegundos!`);
  next();
});

// AGGREGATION MIDDLEWARE
// In tourController Aggregations are still been used secret tours at this time...
// so is necessary to exclude from there also at Model level.
tourSchema.pre('aggregate', function (next) {
  // "this" is an array so we insert at the begining with .unshift()
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

  console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);
module.exports = Tour;
