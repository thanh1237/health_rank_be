const express = require("express");
const weightStorageController = require("../controllers/weightStorage.controller");
const router = express.Router();
const validators = require("../middlewares/validators");

/**
 * @route GET api/weightStorage?page=1&limit=10
 * @description Get weightStorage with pagination
 * @access Public
 */
router.get("/", weightStorageController.getAllWeightStorage);

/**
 * @route GET api/weightStorage/:id
 * @description Get a single weightStorage with author id
 * @access Public
 */
router.get("/:id", weightStorageController.getWeightStorageByAuthor);

/**
 * @route POST api/weightStorage
 * @description Create a new weight
 * @access Login required
 */
router.post("/", weightStorageController.createNewWeightStorage);
// /**
//  * @route PUT api/weights/:id
//  * @description Update a weight
//  * @access Login required
//  */
// router.put("/:id", weightController.updateSingleWeight);
// /**
//  * @route DELETE api/weights/:id
//  * @description Delete a weight
//  * @access Login required
//  */

module.exports = router;
