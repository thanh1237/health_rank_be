const { AppError, catchAsync, sendResponse } = require("../helpers/utils.helper");
const Weight = require("../models/Weight");
const WeightStorage = require("../models/WeightStorage");

const weightStorageController = {};

weightStorageController.getAllWeightStorage = catchAsync(async (req, res, next) => {
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const totalWeights = await WeightStorage.countDocuments({
        ...filter,
        isDeleted: false,
    });
    const totalPages = Math.ceil(totalWeights / limit);
    const offset = limit * (page - 1);

    const weightStorages = await WeightStorage.find(filter)
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("weight");

    return sendResponse(res, 200, true, { weightStorages, totalPages }, null, "");
});

weightStorageController.getWeightStorageByAuthor = catchAsync(async (req, res, next) => {
    let weight = await WeightStorage.find({ author: req.params.id }).populate("weight");
    if (weight.length === 0) {
        return sendResponse(res, 200, true, [], null, null);
    } else {
        const weightArray = weight[0].weight;
        const weightLength = weightArray.length;
        let bmiArray = [];
        let fatArray = [];
        let weightDailyArray = [];
        if (weightLength < 7) {
            for (let i = 0; i < weightLength; i++) {
                bmiArray.push(weightArray[i].bmi);
                fatArray.push(weightArray[i].bodyFat);
                weightDailyArray.push(weightArray[i].weight);
            }
        } else {
            for (let i = 0; i < 7; i++) {
                bmiArray.push(weightArray[i].bmi);
                fatArray.push(weightArray[i].bodyFat);
                weightDailyArray.push(weightArray[i].weight);
            }
        }
        const aveBmi = Math.round((bmiArray.reduce((a, b) => a + b, 0) / bmiArray.length) * 100) / 100;
        const aveFat = Math.round((fatArray.reduce((a, b) => a + b, 0) / fatArray.length) * 100) / 100;
        const aveWeight = Math.round((weightDailyArray.reduce((a, b) => a + b, 0) / weightDailyArray.length) * 100) / 100;
        const updateWeightStorage = await WeightStorage.findOneAndUpdate(
            { _id: weight[0]._id },
            {
                averageWeight: aveWeight,
                averageBMI: aveBmi,
                averageBodyFat: aveFat,
            },
            { new: true }
        ).populate("weight");
        return sendResponse(res, 200, true, updateWeightStorage, null, null);
    }
});

weightStorageController.createNewWeightStorage = catchAsync(async (req, res, next) => {
    const { goal, active, height, weight, goalWeight, weekGoalChange, userId, gender, age } = req.body;
    const weightNumber = Number(weight);
    const heightNumber = Number(height / 100);
    const bmi = Math.round((weightNumber / (heightNumber * heightNumber)) * 100) / 100;
    let newWeight;
    let percentBodyFat;
    try {
        if (gender === "male") {
            percentBodyFat = Math.round((1.2 * bmi + 0.23 * age - 16.2) * 100) / 100;
        } else {
            percentBodyFat = Math.round((1.2 * bmi + 0.23 * age - 5.4) * 100) / 100;
        }

        newWeight = await Weight.create({
            weight: weightNumber,
            height: heightNumber,
            author: userId,
            bodyFat: percentBodyFat,
            bmi,
        });
        if (newWeight) {
            await WeightStorage.create({
                weight: [newWeight._id],
                height: heightNumber,
                author: userId,
                averageWeight: weightNumber,
                averageBMI: bmi,
                averageBodyFat: percentBodyFat,
                goal,
                active,
                goalWeight,
                weekGoalChange,
            });
        }
    } catch (error) {
        console.log(error);
    }

    return sendResponse(res, 200, true, newWeight, null, "Create new weight successful");
});

// weightController.updateSingleWeight = catchAsync(async (req, res, next) => {
//   const weightId = req.params.id;
//   const { weight, height, author } = req.body;
//   const bmi = Math.round((weight / (height * height)) * 100) / 100;
//   const weightFound = await Weight.findOneAndUpdate(
//     { _id: weightId, author },
//     { weight, height, bmi },
//     { new: true }
//   );
//   if (!weightFound)
//     return next(
//       new AppError(
//         400,
//         "Weight not found or User not authorized",
//         "Update Weight Error"
//       )
//     );
//   return sendResponse(
//     res,
//     200,
//     true,
//     weightFound,
//     null,
//     "Update Weight successful"
//   );
// });

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

module.exports = weightStorageController;
