const mongoose = require('mongoose');
const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: String,
  hobby: { type: [String] },
  gender: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  section: {
    type: String,
    required: true,
  },
  class: {
    type: Number,
    required: true,
  },
  rollno: {
    type: Number,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
  image: {
    type: String,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course',
  },
  createdat: {
    type: Date,
    default: Date.now(),
  },
  updatedat: {
    type: Date,
    default: Date.now(),
  },
});

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  course_id: {
    type: String,
    required: true,
  },
});

const CourseModel = new mongoose.model('course', CourseSchema);

const StudentModel = new mongoose.model('Student', StudentSchema);

module.exports = { CourseModel, StudentModel };
