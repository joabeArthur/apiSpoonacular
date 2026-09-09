const axios = require("axios");

const traduzir = async (texto) => {
    try {
        const url = `https://lingva.ml/api/v1/en/pt/${encodeURIComponent(texto)}`;
        const resposta = await axios.get(url);

        return resposta.data.translation;
    } catch (erro) {
        console.error("Erro na tradução:", erro.message);
        return texto;
    }
};