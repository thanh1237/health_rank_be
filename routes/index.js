const express = require("express");
const router = express.Router();

// userApi
const userApi = require("./user.api");
router.use("/users", userApi);

// authApi
const authApi = require("./auth.api");
router.use("/auth", authApi);

//weightApi
const weightApi = require("./weight.api");
router.use("/weights", weightApi);

//weightApi
const weightStorageApi = require("./weightStorage.api");
router.use("/weightStorage", weightStorageApi);

//rankApi
const rankApi = require("./rank.api");
router.use("/rank", rankApi);

//dailyInTakeApi
const dailyInTakeApi = require("./dailyInTake.api");
router.use("/dailyInTake", dailyInTakeApi);

//foodApi
const foodApi = require("./food.api");
router.use("/food", foodApi);

module.exports = router;
