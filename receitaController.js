const axios = require("axios");

const getReceitas = async (req, res) => {
    try {
        const { query } =req.query;
        const resposta = await axios.get("https://api.spoonacular.com/recipes/complexSearch",{
            params: {
                apiKey: process.env.API_KEY,
                query: query
            }
        });
        res.json(resposta.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao buscar receitas" });
    }
}