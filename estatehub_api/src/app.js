// const { sequelize } = require('./models');
// sequelize.sync({ alter: true });

require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/authRoute');
const error = require('./middlewares/error');
const notFound = require('./middlewares/notFound');
const userRoute = require('./routes/userRoute');
const postRoute = require('./routes/postRoute');
const commentRoute = require('./routes/commentRoute');
const authenticate = require('./middlewares/authenticate');

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use('/auth', authRoute);
app.use('/users', authenticate, userRoute);
app.use('/posts', authenticate, postRoute);
app.use('/comments', authenticate, commentRoute);

// app.all('*', function (req, res, next) {
//   const origin = cors.origin.contains(req.header('origin').toLowerCase())
//     ? req.headers.origin
//     : cors.default;
//   res.header('Access-Control-Allow-Origin', origin);
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept'
//   );
//   next();
// });

app.use(error);
app.use(notFound);

const port = process.env.PORT || 8001;
app.listen(port, () => {
  console.log(`the server is running on port ${port}`);
});
