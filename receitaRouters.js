const express = require("express");
const router = express.Router();

const { getReceitas } = require("./receitaController");

router.get("/", getReceitas);
module.exports = router;