const express = require('express');
const path = require('path');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const multer = require('multer');
const app = express();
require('dotenv').config();
//url-encoding
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//session messages
app.use(
  session({
    secret: 'my top secret',
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//define view-engine template
app.set('view engine', 'ejs');

//set views folder to view-engine
app.set('views', 'views');

//use public folder as static assest

app.use(express.static(path.join(__dirname, 'public')));

//multer to store image in uploads folder

app.use(express.static(path.join(__dirname, 'uploads')));

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.includes('png') ||
    file.mimetype.includes('jpg') ||
    file.mimetype.includes('jpeg')
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fieldSize: 1024 * 1024 * 5 },
  }).single('image')
);

//route
const StudentRoutes = require('./routes/studentRoutes');
app.use(StudentRoutes);

//mongoose connection String
const dbDriver = process.env.MONGODB_URI;


//connect to mongoose database
mongoose
  .connect(dbDriver, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((result) => {
    //*port and connection to the server
    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log('Mongoose database connected');

      console.log(`Server is running on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
