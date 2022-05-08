const express = require("express");
const dailyInTakeController = require("../controllers/dailyInTake.controller");
const router = express.Router();
const validators = require("../middlewares/validators");

/**
 * @route GET api/dailyInTake?page=1&limit=10
 * @description Get dailyInTake userId
 * @access Public
 */
router.get("/:id", dailyInTakeController.getDailyIntakeByAuthor);

module.exports = router;
