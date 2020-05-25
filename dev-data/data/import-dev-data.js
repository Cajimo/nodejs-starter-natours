//!Script for import data
const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv'); //!Environment Variables
const Tour = require('./../../models/tourModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  //.connect(process.env.DATABASE_LOCAL, { Para usar localmente
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true, //!Posible error
  })
  .then(() => console.log('DB conección exitosa!'));

//!Read JSON file
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//!Import data into db
const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Importación de datos exitosa!!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

//!Delete all data from db
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Datos borrados correctamente!!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
