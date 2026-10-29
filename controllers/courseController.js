const Course = require('../models/Course');
const Category = require('../models/Category');

const createCourse = async (req, res, next) => {
  try {
    const { title, description, price, category } = req.body;

    if (!title || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, price and category are required',
      });
    }

    const catExists = await Category.findById(category);
    if (!catExists) {
      return res.status(400).json({
        success: false,
        message: 'Category not found with this ID',
      });
    }

    const course = await Course.create({ title, description, price, category });

    res.status(201).json({
      success: true,
      message: 'Course created',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

const getCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .populate('category', 'name description')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'category',
      'name description'
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, data: course });
  } catch (error) {
    next(error);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, message: 'Course updated', data: course });
  } catch (error) {
    next(error);
  }
};

const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.status(200).json({ success: true, message: 'Course deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
};