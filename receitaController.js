const axios = require("axios");

const traduzir = async (texto, de = "en", para = "pt") => {
    try {
        if (!texto) return "";

        const url = "https://api.mymemory.translated.net/get?q=" + encodeURIComponent(texto) + "&langpair=" + de + "|" + para;

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
            resposta.data.results.map(async receita => {
                return {
                    ...receita,
                    title: await traduzir(receita.title, "en", "pt")
                };
            })
        );

        res.json({
            ...resposta.data,
            results: resultadosTraduzidos
        });
    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: "Erro ao buscar receitas"
        });
    }
};

const getDetalhesReceita = async (req, res) => {
    try {
        const { id } = req.params;

        const resposta = await axios.get(
            `https://api.spoonacular.com/recipes/${id}/information`,
            {
                params: {
                    apiKey: process.env.API_KEY
                }
            }
        );

        const receita = resposta.data;

        const titulo = await traduzir(receita.title, "en", "pt");

        const ingredientes = await Promise.all(
            receita.extendedIngredients.map(async ingrediente => {
                return {
                    ...ingrediente,
                    original: await traduzir(ingrediente.original, "en", "pt")
                };
            })
        );

        let instrucoes = receita.instructions;

        if (instrucoes) {
            instrucoes = await traduzir(instrucoes, "en", "pt");
        } else {
            instrucoes = "Modo de preparo não disponível.";
        }

        res.json({
            ...receita,
            title: titulo,
            extendedIngredients: ingredientes,
            instructions: instrucoes
        });
    } catch (error) {
        console.error(error.response?.data || error.message);

        res.status(500).json({
            error: "Erro ao buscar detalhes da receita"
        });
    }
};

module.exports = {
    getReceitas,
    getDetalhesReceita
};