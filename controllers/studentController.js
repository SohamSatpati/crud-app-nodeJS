const express = require('express');
const fs = require('fs');
const { StudentModel, CourseModel } = require('../models/models');

exports.list = (req, res) => {
  StudentModel.find({ status: false }, (err, data) => {
    if (!err) {
      res.render('list', {
        title: 'Student/List',
        studentData: data,
      });
    }
  });
};

exports.index = (req, res) => {
  res.render('index', {
    title: 'Student/Home',
  });
};

exports.about = (req, res) => {
  res.render('about', {
    title: 'Student/About',
  });
};

exports.contact = (req, res) => {
  res.render('contact', {
    title: 'Student/Contact',
  });
};

exports.registration = (req, res) => {
  CourseModel.find({}, (err, data) => {
    if (!err) {
      res.render('registration', {
        title: 'Student/Registration',
        courseData: data,
      });
    }
  });
};

exports.getCourse = (req, res) => {
  CourseModel.findById({ _id: req.body.id }, (err, data) => {
    if (err) throw err;
    res.json({
      course: data,
    });
  });
};

exports.checkEmailAlreadyExists = async (req, res) => {
  console.log(req.body);

  try {
    const isEmailExists = await StudentModel.find({ email: req.body.email });
    console.log(isEmailExists);

    if (isEmailExists.length > 0) {
      res.json({ emailExists: true });
    } else {
      res.json({ emailExists: false });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addStudent = (req, res) => {
  const userimage = req.file.filename;
  const { course: course_id } = req.body;

  const newStudent = new StudentModel({
    name: req.body.name,
    address: req.body.address.trim(),
    email: req.body.email.toLowerCase(),
    phone: req.body.phone,
    gender: req.body.gender,
    city: req.body.city,
    state: req.body.state,
    section: req.body.section,
    class: req.body.class,
    rollno: req.body.rollno,
    hobby: req.body.hobby,
    image: userimage,
    course: course_id,
  });

  newStudent.save((err) => {
    if (err) {
      res.json({ message: err.message, type: 'danger' });
    } else {
      req.session.message = {
        type: 'success',
        message: 'Student added successfully!',
      };
      res.redirect('/list');
    }
  });
};

exports.getStudent = (req, res) => {
  // console.log(req.params);
  const { id, type } = req.params;

  StudentModel.findOne({ _id: id })
    .populate('course', '-_id')
    .exec(function (err, studentData) {
      if (err) throw err;

      if (type == 'edit') {
        CourseModel.find({}, (err, courseData) => {
          if (err) throw err;

          res.render('studentDetails', {
            title: 'Details',
            studentData: studentData,
            courseData: courseData,
          });
        });
      } else {
        res.render('studentinfo', {
          title: 'Details',
          studentData: studentData,
        });
      }
    });
};

//*soft-delete
exports.deleteStudent = (req, res) => {
  StudentModel.findByIdAndUpdate(
    req.params.id,
    { status: true },
    (err, data) => {
      if (data.image !== '') {
        try {
          fs.unlinkSync(`./uploads/${data.image}`);
        } catch (error) {
          console.log(error);
        }
      }
      if (err) {
        res.json({ message: err.message, type: 'danger' });
      } else {
        req.session.message = {
          type: 'success',
          message: 'User Deleted successfully!',
        };
        res.redirect('/list');
      }
    }
  );
};

//*hard-delete
// exports.deleteStudent = (req, res) => {
//   StudentModel.findByIdAndRemove(req.params.id, (err, result) => {
//     if (result.image !== '') {
//       try {
//         fs.unlinkSync(`./uploads/${result.image}`);
//       } catch (error) {
//         console.log(error);
//       }
//     }
//     if (err) {
//       res.json({ message: err.message, type: 'danger' });
//     } else {
//       req.session.message = {
//         type: 'info',
//         message: 'Student Deleted successfully!',
//       };
//       res.redirect('/list');
//     }
//   });
// };

exports.updateStudent = (req, res) => {
  console.log(req.file);

  let newImage = '';
  if (req.file) {
    newImage = req.file.filename;
    try {
      fs.unlinkSync(`./uploads/${req.body.oldImage}`);
    } catch (err) {
      console.log(err);
    }
  } else {
    newImage = req.body.oldImage;
  }
  console.log(req.body);

  const student_id = req.body.s_id;
  const { course: course_id } = req.body;
  const name = req.body.name;
  const address = req.body.address.trim();
  const email = req.body.email;
  const phone = req.body.phone;
  const gender = req.body.gender;
  const city = req.body.city;
  const state = req.body.state;
  const section = req.body.section;
  const classStudies = req.body.class;
  const rollno = req.body.rollno;
  const hobby = req.body.hobby;

  //console.log(product_id,product_name,price,size,details,image)
  StudentModel.findByIdAndUpdate(
    student_id,
    {
      name,
      email,
      phone,
      address,
      gender,
      city,
      state,
      section,
      class: classStudies,
      rollno,
      hobby,
      image: newImage,
      course: course_id,
    },
    (err, result) => {
      if (err) {
        res.json({ message: err.message, type: 'danger' });
      } else {
        req.session.message = {
          type: 'success',
          message: 'Student Updated successfully!',
        };
        res.redirect('/list');
      }
    }
  );
};
