const {google} = require('googleapis');
const express = require("express");
require('dotenv').config();

//Divisão de Pastar por Funcionalidade
/** 
const googleCalendar = require("./googleCalendar");
const googleSheet = require("./googleSheet");
const googleFirebase = require("./googleFirebase");
const functions = require("./functions");
**/

const app = express();

app.get('/', (req, res) => {
    res.send("Olá Mundo 2");
})

const porta = process.env.PORT || 8080;
const hostname  ='127.0.0.1';

app.listen(porta, () => {
    console.log(`Servidor rodando em: https://${hostname}:${porta}`); // concatenação com crase (`)
})