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
    
    switch(intencao) {
        case 'Default Welcome Intent':

            break;
        case 'verCardapio':
            //resposta = await googleCalendar.verCardapio( mensagem, parametros );
            break;
        case 'verStatus':
            //resposta = googleCalendar.verStatus( mensagem, parametros );
            break;
        case 'marcarConsulta':
        //case 'followupmarcarConsulta': precisa corrigir essa linha
//
          break;
        case 'verAgenda':
            //resposta = await googleCalendar.verAgenda( mensagem, parametros );
            break;
        case 'salvarPlanilha':
            //resposta = await googleSheet.salvarPlanilha( mensagem, parametros );
            break;
        case 'verPlanilha':
            //resposta = await googleSheet.verPlanilha( mensagem, parametros );
            break;
        case 'teste':

              resposta = {
                tipo: 'texto', 
                mensagem: 'Abacaxi, abacaxi.'
              }

              break;
        default: 
            resposta = {
                tipo: 'texto', 
                mensagem: 'Sinto muito, não entendi o que você quer.'
            }
    }
    
    
    
    if ( resposta.tipo == 'texto') {
      responder = {
        "fulfillmentText": "Resposta do Webhook",
        "fulfillmentMessages": [
          {
            "text": {
              "text": [
                resposta.mensagem
              ]
            }
          }
        ],
        "source": "",
      }
    } else if ( resposta.tipo == 'imagem' ) {
      responder = {
        "fulfillmentText": "Resposta do Webhook",
        "fulfillmentMessages": [
          {
            "image": {
              "imageUri": resposta.url,
            }
          }
        ],
        "source": "",
      }
    } else if (resposta.tipo == 'card'){
        responder = {
          "fulfillmentText": "Resposta do Webhook",
          "fulfillmentMessages": [
            {
              "card":{
                "title": resposta.titulo,
                "subtitle": resposta.preco,
                "imageUri": resposta.url
              }
            }, 
            {
              "card":{
                "title": resposta.titulo,
                "subtitle": resposta.preco,
                "imageUri": resposta.url
              }
            }

          ],
          "source": "", 
        }
    } else if (resposta.tipo == 'context'){
      responder = resposta.mensagem
  } 

    res.send(responder);
})

const porta = process.env.PORT || 8080;
const hostname  ='127.0.0.1';

app.listen(porta, hostname, () => {
    console.log(`Servidor rodando em: https://${hostname}:${porta}`); // concatenação com crase (`)
})