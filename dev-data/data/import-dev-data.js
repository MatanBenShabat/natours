/* eslint-disable */
const fs = require('fs');
const mongoose = require('mongoose');
require('dotenv').config({ path: './config.env' });
const Tour = require('../../models/tourModel');
const User = require('../../models/userModel');
const Review = require('../../models/reviewModel');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours.json`, {
    encoding: 'utf-8',
  })
);
const users = JSON.parse(
  fs.readFileSync(`${__dirname}/users.json`, {
    encoding: 'utf-8',
  })
);
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, {
    encoding: 'utf-8',
  })
);

const importData = async () => {
  try {
    await Tour.create(tours);
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    console.log('Data Loaded');
  } catch (error) {
    throw error;
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await User.deleteMany();
    await Review.deleteMany();
    console.log('Data Deleted');
  } catch (error) {
    throw error;
  }
};

(async () => {
  try {
    console.log('Connecting to DB...');

    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    console.log('Connected');

    if (process.argv[2] === '--import') {
      await importData();
    } else if (process.argv[2] === '--delete') {
      await deleteData();
    } else {
      console.error('Available options: --import || --delete');
    }
  } catch (error) {
    console.log({ error });
  }

  console.log('Disconnecting...');
  mongoose.connection.close();
})();
