const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const weightSchema = Schema(
    {
        weight: { type: Number, default: 0 },
        bodyFat: { type: Number, default: 0 },
        height: { type: Number, default: 0 },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        bmi: { type: Number, default: 0 },
        todaySubmitted: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false, select: false },
    },
    { timestamps: true }
);

weightSchema.plugin(require("./plugins/isDeletedFalse"));

const Weight = mongoose.model("Weight", weightSchema);
module.exports = Weight;
