const mongoose = require('mongoose');
const dotenv = require('dotenv'); //!Environment Variables

//Handling "uncaught exceptions"
process.on('uncaughtException', (err) => {
  console.log('EXCEPCIÓN NO CAPTURADA! 💣 Apagando...');
  console.log(err.name, err.message);

  process.exit(1);
});

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
const server = app.listen(port, () => {
  console.log(`App corriendo en puerto: ${port}...`);
});

//Handling "unhandledRejection"
process.on('unhandledRejection', (err) => {
  console.log('RECHAZO NO MANEJADO! 📣 Apagando...');
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});

//console.log(x);
