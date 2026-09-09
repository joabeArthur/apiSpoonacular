const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
console.log("API_KEY existe?", !!process.env.API_KEY);

const app = express();

app.use(express.json());

const receitaRoutes = require("./receitaRouters");

app.use("/receitas", receitaRoutes);

const PORT = 3000;

app.get("/", (req, res) => {
    res.json({
        message: "a API funciona"
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});