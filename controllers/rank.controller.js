const { AppError, catchAsync, sendResponse } = require("../helpers/utils.helper");
const User = require("../models/User");
const Weight = require("../models/Weight");
const WeightStorage = require("../models/WeightStorage");
const moment = require("moment");

const rankController = {};

rankController.getRank = catchAsync(async (req, res, next) => {
    const userId = req.params.id;
    // get current user weight storage
    const currentUserWeightStorage = await WeightStorage.findOne({ author: userId });
    const goalCategory = currentUserWeightStorage.goal;

    // get list weightStorage with same goal
    let { page, limit, sortBy, ...filter } = { ...req.query };
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 50;
    const totalWeights = await WeightStorage.countDocuments({
        ...filter,
        isDeleted: false,
    });
    const totalPages = Math.ceil(totalWeights / limit);
    const offset = limit * (page - 1);

    const weightStorage = await WeightStorage.find({ goal: goalCategory })
        .sort({ ...sortBy, createdAt: -1 })
        .skip(offset)
        .limit(limit)
        .populate("author")
        .populate("weight");

    // put score element in weightStorage
    const weightStorageWithScore = weightStorage.map((e) => {
        let score = 0;
        const weights = e.weight;
        const sortedWeight = weights.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        if (sortedWeight.length > 1) {
            if (sortedWeight.length < 8) {
                score = Number(sortedWeight[0].weight) - Number(sortedWeight[sortedWeight.length - 1].weight);
            } else {
                score = Number(sortedWeight[0].weight) - Number(sortedWeight[6].weight);
            }
        } else {
            score = weights[0].bodyFat;
        }
        return { ...e, score };
    });

    // get score array by score
    const sortedByScore = weightStorageWithScore.slice().sort(function (a, b) {
        return goalCategory === "gain" ? b.score - a.score : goalCategory === "lose" ? a.score - b.score : null;
    });
    // ranking
    const ranks = sortedByScore.map((v) => {
        return { ...v, rank: sortedByScore.indexOf(v) + 1 };
    });

    // console.log(ranks);
    return sendResponse(res, 200, true, { ranks, totalPages }, null, "");
});

module.exports = rankController;
