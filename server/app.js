const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const error = require('./middlewares/error');
const cors = require('cors');
const ErrorHandler = require('./utils/errorHandler');
//const fileUpload = require("express-fileupload");
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

//const productRoute = require('./routes/productRoutes');
const userRoute = require('./routes/userRoutes');
//const categoryRoutes = require('./routes/categoryRoutes');
//const attemptRoutes = require('./routes/AttemptRoutes');

//const reviewRoutes = require('./routes/reviewRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cookieParser());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // frontend URL
  credentials: true,
}));
app.options('*', cors());
app.use(helmet());
app.use(mongoSanitize());
app.set('trust proxy', 1); // for secure cookies behind a proxy

app.use(xss());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.use('/api/v1/users/', userRoute)
//app.use('/api/v1/products/', productRoute)
//app.use('/api/v1/categories/', categoryRoutes)
app.use('/api/v1/orders/', orderRoutes)
//app.use('/api/v1/attempts/', attemptRoutes)

https://224f-105-235-128-119.ngrok-free.app
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
  });

app.use(error);

module.exports =  app ;
