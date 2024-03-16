const express = require("express");
const { getAllUsers, createUser, loginUser } = require('../controller/user')
const checkSession = require("../middleware/checkSession")

const router = express.Router();

router.post("/", checkSession, getAllUsers)
router.post("/login", loginUser)
router.post("/create", createUser)

module.exports = router