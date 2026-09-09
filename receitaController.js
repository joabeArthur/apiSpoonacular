const axios = require("axios");

const traduzir = async (texto, de = "pt", para = "en") => {
    try {
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(texto)}&langpair=${de}|${para}`;
        const resposta = await axios.get(url);
        
        if (resposta.data && resposta.data.responseData) {
            return resposta.data.responseData.translatedText;
        }
        return texto;
    } catch (erro) {
        console.error("Erro na tradução:", erro.message);
        return texto;
    }
};

const getReceitas = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({
                erro: "Informe uma receita para pesquisar"
            });
        }

        const queryEmIngles = await traduzir(query, "pt", "en");

        const resposta = await axios.get(
            "https://api.spoonacular.com/recipes/complexSearch",
            {
                params: {
                    apiKey: process.env.API_KEY,
                    query: queryEmIngles,
                    number: 10
                }
            }
        );

        const resultadosTraduzidos = await Promise.all(
            resposta.data.results.map(async (receita) => {
                const tituloEmPortugues = await traduzir(receita.title, "en", "pt");
                return {
                    ...receita,
                    title: tituloEmPortugues
                };
            })
        );

        res.json({
            ...resposta.data,
            results: resultadosTraduzidos
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Erro ao buscar receitas"
        });
    }
};

module.exports = {
    getReceitas
};