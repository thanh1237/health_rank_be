const express = require("express");
const rankController = require("../controllers/rank.controller");
const router = express.Router();

/**
 * @route GET api/rank?page=1&limit=10
 * @description Get rank with pagination
 * @access Public
 */
router.get("/:id", rankController.getRank);

module.exports = router;
