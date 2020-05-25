const mongoose = require('mongoose');
const dotenv = require('dotenv'); //!Environment Variables

dotenv.config({ path: './config.env' });
const app = require('./app'); //!Application itself

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

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App corriendo en puerto: ${port}...`);
});
