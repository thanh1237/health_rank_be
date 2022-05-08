const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const foodSchema = Schema(
    {
        brandName: { type: String, default: "" },
        description: { type: String, required: true },
        type: { type: String, required: true },
        author: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "User",
        },
        servingQuantity: { type: Number, required: true },
        servingUnit: { type: String, required: true },
        calories: { type: Number, required: true },
        totalFat: { type: Number, default: 0 },
        saturatedFat: { type: Number, default: 0 },
        transFat: { type: Number, default: 0 },
        polyunsaturatedFat: { type: Number, default: 0 },
        monounsaturatedFat: { type: Number, default: 0 },
        cholesterol: { type: Number, default: 0 },
        sodium: { type: Number, default: 0 },
        carbohydrates: { type: Number, default: 0 },
        dietaryFibers: { type: Number, default: 0 },
        sugars: { type: Number, default: 0 },
        protein: { type: Number, default: 0 },
        calcium: { type: Number, default: 0 },
        iron: { type: Number, default: 0 },
        potassium: { type: Number, default: 0 },
        vitaminA: { type: Number, default: 0 },
        vitaminC: { type: Number, default: 0 },
        isDeleted: { type: Boolean, default: false, select: false },
    },
    { timestamps: true }
);

foodSchema.plugin(require("./plugins/isDeletedFalse"));

const Food = mongoose.model("Food", foodSchema);
module.exports = Food;
