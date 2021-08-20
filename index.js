const {google} = require('googleapis');
const express = require("express");
require('dotenv').config();

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Olá Mundo 23");
})


app.post('/webhook', async (req, res) => {
    
    
    res.send(responder);
})

const porta = process.env.PORT || 8080;
const hostname  ='127.0.0.1';

app.listen(porta, () => {
    console.log(`Servidor rodando em: https://${hostname}:${porta}`); // concatenação com crase (`)
})