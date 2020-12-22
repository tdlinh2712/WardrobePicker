const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const fileupload = require('express-fileupload');
const connectDB = require('./config/db');
//route files
const wardrobes = require('./routes/wardrobes');
const items = require('./routes/items');
const errorHandler = require('./middleware/error');

//load env vars
dotenv.config({ path: './config/config.env' });

//connect to db
connectDB();
const app = express();
//body parser
app.use(express.json());

//dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//file uploading
app.use(fileupload());
app.use(express.static(path.join(__dirname, 'public')));
//Mount routers
app.use('/api/v1/wardrobes', wardrobes);
app.use('/api/v1/items', items);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT, 
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

//handle unhandled rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    //close server 
    server.close(() => process.exit(1));
});