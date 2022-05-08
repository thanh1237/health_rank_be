const { catchAsync, sendResponse } = require("../helpers/utils.helper");
const WeightStorage = require("../models/WeightStorage");

const dailyIntakeController = {};

dailyIntakeController.getDailyIntakeByAuthor = catchAsync(async (req, res, next) => {
    const author = req.params.id;
    // get current user weight storage
    let todayData;
    const currentUserWeightStorage = await WeightStorage.findOne({ author }).populate("weight");
    const latestData = currentUserWeightStorage.weight[currentUserWeightStorage.weight.length - 1];
    const weight = latestData.weight;
    const bodyFat = latestData.bodyFat;
    const lbm = Number((weight * (100 - bodyFat)) / 100).toFixed(0);
    const bmr = Number(370 + 21.6 * lbm).toFixed(0);
    const active = currentUserWeightStorage.active;
    const weekGoalChange = currentUserWeightStorage.weekGoalChange;
    let R = active === "not" ? 1.2 : active === "lightly" ? 1.375 : active === "active" ? 1.55 : active === "very" ? 1.8 : 0;
    const tdee = Number(bmr * R).toFixed(0);
    const tci =
        weekGoalChange === "gain0.25"
            ? Number(tdee * 1.1).toFixed(0)
            : weekGoalChange === "gain0.5"
            ? Number(tdee * 1.3).toFixed(0)
            : weekGoalChange === "lose0.25"
            ? Number(tdee * 0.8).toFixed(0)
            : weekGoalChange === "lose0.5"
            ? Number(tdee * 0.6).toFixed(0)
            : weekGoalChange === "maintain"
            ? Number(tdee).toFixed(0)
            : 0;
    const protein = Number(weight * 2.4).toFixed(0);
    const fat = 75;
    const carbohydrate = Number((tci - protein * 4 - 75 * 9) / 4).toFixed(0);
    try {
        if (!lbm || !bmr || !tdee || !tci || !protein || !carbohydrate || !fat) {
            return;
        }
        todayData = await WeightStorage.findOneAndUpdate(
            { author },
            {
                lbm,
                bmr,
                tdee,
                tci,
                protein,
                carbohydrate,
                fat,
            },
            {
                new: true,
            }
        );
    } catch (error) {
        console.log(error);
    }

    return sendResponse(res, 200, true, todayData, null, "");
});

module.exports = dailyIntakeController;
