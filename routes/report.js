const express = require("express");
const { generateReport, getAllReports } = require('../controller/report')
const checkSession = require("../middleware/checkSession")

const router = express.Router();

router.get('/', checkSession, getAllReports)
router.post("/generate", checkSession, generateReport)

module.exports = router