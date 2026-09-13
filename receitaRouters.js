const express = require("express");

const router = express.Router();

const {
    getReceitas,
    getDetalhesReceita
} = require("./receitaController");

router.get("/", getReceitas);
router.get("/:id", getDetalhesReceita);

module.exports = router;