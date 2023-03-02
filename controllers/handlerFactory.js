const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();

    const newDoc = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: { [modelName]: newDoc } });
  });

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();
    const searchParam = {
      _id: req.params.id,
    };

    if (req.isReview) {
      searchParam.user = req.user._id;
    }

    const doc = await Model.findOneAndDelete(searchParam);

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(204).json({ status: 'success', data: null });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();
    const searchParam = {
      _id: req.params.id,
    };

    if (req.isReview) {
      searchParam.user = req.user._id;
    }

    const doc = await Model.findOneAndUpdate(searchParam, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(200).json({ status: 'success', data: { [modelName]: doc } });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const modelName = Model.modelName.toLowerCase();

    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError(`No ${modelName} found with that ID`, 404));
    }

    res.status(200).json({ status: 'success', data: { [modelName]: doc } });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const modelPluralName = Model.modelName.toLowerCase() + 's';
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    let query = Model.find(filter);

    if (req.query) query = new APIFeatures(query, req.query).getEndQuery();

    const results = await query;

    res.status(200).json({
      status: 'success',
      results: results.length,
      data: { [modelPluralName]: results },
    });
  });
