const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json());

const PORT = 3000;

app.get("/receitas", async (req, res) => {

})

app.get("/", (req, res) => {
    res.json({ message: "a API funciona"  });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})