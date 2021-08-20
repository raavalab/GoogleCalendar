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

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Olá Mundo 2");
})


app.post('/webhook', async (req, res) => {
    
    const mensagem = req.body.queryResult.queryText;
    const intencao = req.body.queryResult.intent.displayName;

    switch(intencao) {
        case 'Default Welcome Intent':
            break;
        case 'verCardapio':
            break;
        case 'verStatus':
            break;
        case 'marcarConsulta':
          break;
        case 'verAgenda':
            break;
        case 'salvarPlanilha':
            break;
        case 'verPlanilha':
            break;
        case 'teste':
              break;
        default: 
    }
    

})

const porta = process.env.PORT || 8080;
const hostname  ='127.0.0.1';

app.listen(porta, hostname, () => {
    console.log(`Servidor rodando em: https://${hostname}:${porta}`); // concatenação com crase (`)
})