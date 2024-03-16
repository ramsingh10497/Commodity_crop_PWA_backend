const express = require("express");
const { getAllCrops } = require('../controller/crop')
const checkSession = require("../middleware/checkSession")

const router = express.Router();

router.get("/", checkSession, getAllCrops)

module.exports = router