const express = require("express");
const foodController = require("../controllers/food.controller");
const router = express.Router();

/**
 * @route GET api/foods?page=1&limit=10
 * @description Get foods with pagination
 * @access Public
 */
router.post("/searchFood", foodController.searchFood);
/**
 * @route GET api/foods/:id
 * @description Get a single food with author id
 * @access Public
 */
// router.get("/:id", foodController.getFoodById);

/**
 * @route POST api/foods
 * @description Create a new food
 * @access Login required
 */
router.post("/", foodController.createNewFood);
/**
 * @route PUT api/foods/:id
 * @description Update a food
 * @access Login required
 */
// router.put("/:id", foodController.updateSingleFood);
/**
 * @route DELETE api/foods/:id
 * @description Delete a food
 * @access Login required
 */
// router.put("/:id", foodController.deleteFood);

module.exports = router;
