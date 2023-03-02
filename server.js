const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const app = require('./app');

process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to DB'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server is up on port ${port} in ${process.env.NODE_ENV}.`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});
