const mongoose = require('mongoose');
const validator = require('validator');
const { Schema } = mongoose;
const { model } = mongoose;

// Create a new database
(async function () {
  await mongoose.connect(process.env.mongodb_URL, {
    useNewUrlParser: true,
  });
})();

// inserting document
// const me = new User({
//   name: 'Edwin',
//   email: 'igweedwin@yahoo.com',
//   password: ' edwin123456',
// });

// const task = new Task({
//   description: ' Eat lunch',
// });

// task.save();
// me.save();
