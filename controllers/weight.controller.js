const { AppError, catchAsync, sendResponse } = require("../helpers/utils.helper");
const User = require("../models/User");
const Weight = require("../models/Weight");
const WeightStorage = require("../models/WeightStorage");
const moment = require("moment");

const weightController = {};

weightController.getWeights = catchAsync(async (req, res, next) => {
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalWeights = await Weight.countDocuments({
        ...filter,
        isDeleted: false,
    });
    const totalPages = Math.ceil(totalWeights / limit);
    const offset = limit * (page - 1);

    const weights = await Weight.find(filter)
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("author");

    return sendResponse(res, 200, true, { weights, totalPages }, null, "");
});

weightController.getWeightByAuthor = catchAsync(async (req, res, next) => {
    let weights;
    try {
        weights = await Weight.find({ author: req.params.id }).populate("author");
        if (!weights) return next((weights = await Weight.findById(req.params.id)));
        // const today = moment().format("DD-MM-YYYY");
        // const todayWeight = weights.find((weight) => moment(weight.createdAt).format("DD-MM-YYYY") === today);
        // if (todayWeight) {
        //     const test = await Weight.findByIdAndUpdate({ _id: todayWeight._id }, { todaySubmitted: true }, { new: true });
        //     console.log(test);
        // }
    } catch (error) {
        console.log(error);
    }
    return sendResponse(res, 200, true, weights, null, null);
});

weightController.createNewWeight = catchAsync(async (req, res, next) => {
    const { weight, height, author, bodyFat, gender, age } = req.body;
    const weightNumber = Number(weight);
    const heightNumber = Number(height / 100);
    const bodyFatNumber = Number(bodyFat);
    const bmi = Math.round((weightNumber / (heightNumber * heightNumber)) * 100) / 100;
    let newWeight;
    let percentBodyFat;
    try {
        if (bodyFat === 0) {
            if (gender === "male") {
                percentBodyFat = Math.round((1.2 * bmi + 0.23 * age - 16.2) * 100) / 100;
            } else {
                percentBodyFat = Math.round((1.2 * bmi + 0.23 * age - 5.4) * 100) / 100;
            }
            newWeight = await Weight.create({
                weight: weightNumber,
                height: heightNumber,
                author,
                bodyFat: percentBodyFat,
                bmi,
            });
        } else {
            newWeight = await Weight.create({
                weight: weightNumber,
                height: heightNumber,
                author,
                bodyFat: bodyFatNumber,
                bmi,
            });
            return newWeight;
        }
        const weightStorage = await WeightStorage.find({ author }).exec();
        if (weightStorage.length === 0) {
            await WeightStorage.create({
                weight: [newWeight._id],
                author,
                averageWeight: weightNumber,
                averageBMI: bmi,
                averageBodyFat: percentBodyFat,
            });
        } else {
            const weightObject = weightStorage.find((e) => e.author.equals(author));
            const weightArray = weightObject.weight;
            weightArray.push(newWeight._id);
            await WeightStorage.findOneAndUpdate({ _id: weightObject._id, author }, { weight: weightArray }, { new: true });
        }
        return sendResponse(res, 200, true, true, null, "Create new weight successful");
    } catch (error) {
        console.log(error);
    }
});

weightController.updateSingleWeight = catchAsync(async (req, res, next) => {
    const weightId = req.params.id;
    const { weight, height, author, bodyFat } = req.body;
    const bmi = Math.round((weight / (height * height)) * 100) / 100;
    const user = await User.findById(author);
    let percentBodyFat;
    if (bodyFat !== 0) {
        if (user.gender === "male") {
            percentBodyFat = 1.2 * bmi + 0.23 * user.age - 16.2;
            return percentBodyFat;
        } else {
            percentBodyFat = 1.2 * bmi + 0.23 * user.age - 5.4;
            return percentBodyFat;
        }
    }
    const weightFound = await Weight.findOneAndUpdate({ _id: weightId, author }, { weight, height, bmi, bodyFat: percentBodyFat }, { new: true });
    if (!weightFound) return next(new AppError(400, "Weight not found or User not authorized", "Update Weight Error"));
    return sendResponse(res, 200, true, weightFound, null, "Update Weight successful");
});

// blogController.deleteSingleBlog = catchAsync(async (req, res, next) => {
//   const author = req.userId;
//   const blogId = req.params.id;

//   const blog = await Blog.findOneAndUpdate(
//     { _id: blogId, author: author },
//     { isDeleted: true },
//     { new: true }
//   );
//   if (!blog)
//     return next(
//       new AppError(
//         400,
//         "Blog not found or User not authorized",
//         "Delete Blog Error"
//       )
//     );
//   return sendResponse(res, 200, true, null, null, "Delete Blog successful");
// });

module.exports = weightController;
