const { AppError, catchAsync, sendResponse } = require("../helpers/utils.helper");
const Food = require("../models/Food");

const foodController = {};

foodController.searchFood = catchAsync(async (req, res, next) => {
    let { description, author } = req.body;
    let foods;
    try {
        if (!description) {
            foods = await Food.find({ author }).populate("author");
        } else {
            foods = await Food.find({ description }).populate("author");
        }
    } catch (error) {
        console.log(error);
    }
    return sendResponse(res, 200, true, { foods }, null, "");
});

// foodController.getFoodById = catchAsync(async (req, res, next) => {
//     let weights;
//     try {
//         weights = await Weight.find({ author: req.params.id }).populate("author");
//         if (!weights) return next((weights = await Weight.findById(req.params.id)));
//         // const today = moment().format("DD-MM-YYYY");
//         // const todayWeight = weights.find((weight) => moment(weight.createdAt).format("DD-MM-YYYY") === today);
//         // if (todayWeight) {
//         //     const test = await Weight.findByIdAndUpdate({ _id: todayWeight._id }, { todaySubmitted: true }, { new: true });
//         //     console.log(test);
//         // }
//     } catch (error) {
//         console.log(error);
//     }
//     return sendResponse(res, 200, true, weights, null, null);
// });

foodController.createNewFood = catchAsync(async (req, res, next) => {
    const {
        brandName,
        description,
        type,
        author,
        servingQuantity,
        servingUnit,
        calories,
        totalFat,
        saturatedFat,
        transFat,
        polyunsaturatedFat,
        monounsaturatedFat,
        cholesterol,
        sodium,
        carbohydrates,
        dietaryFibers,
        sugars,
        protein,
        calcium,
        iron,
        potassium,
        vitaminA,
        vitaminC,
    } = req.body;

    try {
        const newFood = await Food.create({
            brandName,
            description,
            type,
            author,
            servingQuantity,
            servingUnit,
            calories,
            totalFat,
            saturatedFat,
            transFat,
            polyunsaturatedFat,
            monounsaturatedFat,
            cholesterol,
            sodium,
            carbohydrates,
            dietaryFibers,
            sugars,
            protein,
            calcium,
            iron,
            potassium,
            vitaminA,
            vitaminC,
        });
        return sendResponse(res, 200, true, newFood, null, "Create new food successful");
    } catch (error) {
        return next(new AppError(500, `${error}`, "Create New Food Error"));
    }
});

// foodController.updateSingleFood = catchAsync(async (req, res, next) => {
//     const weightId = req.params.id;
//     const { weight, height, author, bodyFat } = req.body;
//     const bmi = Math.round((weight / (height * height)) * 100) / 100;
//     const user = await User.findById(author);
//     let percentBodyFat;
//     if (bodyFat !== 0) {
//         if (user.gender === "male") {
//             percentBodyFat = 1.2 * bmi + 0.23 * user.age - 16.2;
//             return percentBodyFat;
//         } else {
//             percentBodyFat = 1.2 * bmi + 0.23 * user.age - 5.4;
//             return percentBodyFat;
//         }
//     }
//     const weightFound = await Weight.findOneAndUpdate(
//         { _id: weightId, author },
//         { weight, height, bmi, bodyFat: percentBodyFat },
//         { new: true }
//     );
//     if (!weightFound) return next(new AppError(400, "Weight not found or User not authorized", "Update Weight Error"));
//     return sendResponse(res, 200, true, weightFound, null, "Update Weight successful");
// });

// foodController.deleteFood = catchAsync(async (req, res, next) => {
//     const author = req.userId;
//     const blogId = req.params.id;

//     const blog = await Blog.findOneAndUpdate({ _id: blogId, author: author }, { isDeleted: true }, { new: true });
//     if (!blog) return next(new AppError(400, "Blog not found or User not authorized", "Delete Blog Error"));
//     return sendResponse(res, 200, true, null, null, "Delete Blog successful");
// });

module.exports = foodController;
