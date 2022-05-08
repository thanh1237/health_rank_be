const express = require("express");
const weightController = require("../controllers/weight.controller");
const router = express.Router();
const validators = require("../middlewares/validators");

/**
 * @route GET api/weights?page=1&limit=10
 * @description Get weights with pagination
 * @access Public
 */
router.get("/", weightController.getWeights);
/**
 * @route GET api/weights/:id
 * @description Get a single weight with author id
 * @access Public
 */
router.get("/:id", weightController.getWeightByAuthor);

/**
 * @route POST api/weights
 * @description Create a new weight
 * @access Login required
 */
router.post("/", weightController.createNewWeight);
/**
 * @route PUT api/weights/:id
 * @description Update a weight
 * @access Login required
 */
router.put("/:id", weightController.updateSingleWeight);
/**
 * @route DELETE api/weights/:id
 * @description Delete a weight
 * @access Login required
 */

module.exports = router;
