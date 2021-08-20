const express = require("express");

const app = express();

app.get('/', (req, res) => {
    res.send("Olá Mundo 234");
})

const porta = process.env.PORT || 8080;
const hostname  ='127.0.0.1';

app.listen(porta, () => {
    console.log(`Servidor rodando em: https://${hostname}:${porta}`); // concatenação com crase (`)
})