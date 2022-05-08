const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weightStorageSchema = Schema(
    {
        weight: [
            {
                type: Schema.Types.ObjectId,
                required: true,
                ref: "Weight",
            },
        ],
        height: { type: Number, default: 0 },
        averageWeight: { type: Number, default: 0 },
        averageBMI: { type: Number, default: 0 },
        averageBodyFat: { type: Number, default: 0 },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        goal: { type: String, default: "" },
        active: { type: String, default: "" },
        weekGoalChange: { type: String, default: "" },
        goalWeight: { type: Number, default: 0 },
        lbm: { type: Number, default: 0 },
        bmr: { type: Number, default: 0 },
        tdee: { type: Number, default: 0 },
        tci: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        carbohydrate: { type: Number, default: 0 },
        fat: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false, select: false },
    },
    { timestamps: true }
);

weightStorageSchema.plugin(require("./plugins/isDeletedFalse"));

const WeightStorage = mongoose.model("WeightStorage", weightStorageSchema);
module.exports = WeightStorage;
