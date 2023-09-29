const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
app.use(express.json());

// Middleware
// app.use((req, res, next) => {
//   req.method === 'GET' ? res.send('GET request are disabled') : next();
// });

// app.use((req, res, next) => {
//   res.status(503).send('The site is under maintenance');
// });

// Register routers
app.use(userRouter);
app.use(taskRouter);

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// making use of bcrypt
const bcrypt = require('bcryptjs');

const myFunction = async () => {
  const password = 'e2d3w4i5n6';
  const hashedPassword = await bcrypt.hash(password, 8);

  console.log(password);
  console.log(hashedPassword);

  const isMatch = await bcrypt.compare('e2d3w4i5n6', hashedPassword);

  console.log(isMatch);
};
// myFunction();

// json web token (jwt)
const jwt = require('jsonwebtoken');

const myF = async () => {
  const token = jwt.sign({ _id: '12345e' }, 'this is my new course', {
    expiresIn: '7 days',
  });
  console.log(token);

  const data = jwt.verify(token, 'this is my new course');
  console.log(data);
};

// myF();

// User/Task relationship
const Task = require('./models/task');
const User = require('./models/user');

// const multer = require('multer');
// const e = require('express');
// const upload = multer({
//   dest: 'images',
//   limits: {
//     fileSize: 1000000,
//   },
//   fileFilter(req, file, callBack) {
//     // if (!file) return callBack(new Error('Please upload a file'));

//     if (file.originalname.match(/\.(jpg | jpeg | png)$/)){
//        return callBack(new Error('Please upload an inmage'));
//     }

//     callBack(undefined, true);
//   },
// });

// const errorMiddleware = (req, res, next) => {
//   throw new Error('From my middleware');
// };

// app.post(
//   '/upload',
//   upload.single('upload'),
//   (req, res) => {
//     res.send();
//   },
//   (error, req, res, next) => {
//     res.status(400).send({ error: error.message });
//   }
// );

const main = async () => {
  // const task = await Task.findById('6508e300ca5dc25d3d554221');
  // // console.log(task);
  // // console.log(task.owner);
  // await task.populate('owner');
  // console.log(task.owner);
  // const user = await User.findById('6508dde363b3d2b4dd4daf5d');
  // // console.log(user);
  // await user.populate('tasks');
  // console.log(user.tasks);
};

main();

// api key mailcchimp 6b050202f93925483b0ba557d8662979-us18

// mailgun e15aa7eeeef0ae906f72a5375947f0fa-db137ccd-4bd8535d
// 3a643b20c6262b422fe7670f63d10d61-db137ccd-0bab7865
