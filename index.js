const {google} = require('googleapis');
const express = require("express");
require('dotenv').config();

//Divisão de Pastar por Funcionalidade
const googleCalendar = require("./googleCalendar");
const googleSheet = require("./googleSheet");
const googleFirebase = require("./googleFirebase");
const functions = require("./functions");

const app = express();

app.use(express.urlencoded({ extended: false}));
app.use(express.json());

app.get('/', (req, res) => {
    res.send("Olá Mundo 2");
})


app.post('/webhook', async (req, res) => {
    
    const mensagem = req.body.queryResult.queryText;
    const intencao = req.body.queryResult.intent.displayName;
    
    let responder = ""
    let parametros = new Array();

    let varName = '';
    let varPhone = '';

    //console.log('mensagem123: [' + mensagem + ']');
    console.log('intencao: [' + intencao + ']');

    switch(intencao) {
        case 'Default Welcome Intent':

            parametros[0] = req.body.queryResult.parameters['name'];
            parametros[1] = req.body.queryResult.parameters['phone'];

            // Rotina para pegar os parametros do context
            //const contexto = req.body.queryResult.outputContexts[0];
            // varName = req.body.queryResult.outputContexts[0].parameters.name;
            // varPhone = req.body.queryResult.outputContexts[0].parameters.phone;     
            
            resposta = await googleFirebase.defaultWelcome( mensagem, parametros );
            break;
        case 'verCardapio':
            resposta = await googleCalendar.verCardapio( mensagem, parametros );
            break;
        case 'verStatus':
            resposta = googleCalendar.verStatus( mensagem, parametros );
            break;
        case 'marcarConsulta':
        //case 'followupmarcarConsulta': precisa corrigir essa linha
          parametros[0] = req.body.queryResult.parameters['AppointmentType'];
          parametros[1] = req.body.queryResult.parameters['date'];
          parametros[2] = req.body.queryResult.parameters['horas'];
          parametros[3] = req.body.queryResult.parameters['name'];
          parametros[4] = req.body.queryResult.parameters['phone'];

          const session = req.body.queryResult.outputContexts[0].name;;
          let result_session = session.split("/");
          let projectId = result_session[1];
          let sessionId = result_session[4];
      
          let date = new Date(req.body.queryResult.parameters['date']);
          
          let bookingDate = functions.juntadataHoraConsulta(parametros[1], parametros[2]);
          let bookingDateStart = new Date(bookingDate['start']);
          let now = new Date();

          if (bookingDateStart < now){
            console.log(`You can't make a reservation in the past. Please try again!`);

            resposta = {
              tipo: 'texto', 
              mensagem: 'Desculpe, não é possivel marcar uma consulta no passado. Favor tentar novamente.'
            }

          } else if (bookingDateStart.getFullYear() > now.getFullYear()) {
            let booking_year = bookingDateStart.getFullYear();
            let now_year = now.getFullYear();
            console.log(`You can't make a reservation for ${booking_year} yet. Please choose a date in ${now_year}. `);

            resposta = {
              tipo: 'texto', 
              mensagem: `Desculpe, não é possivel marcar uma consulta para ${booking_year} ainda. Favor tentar novamente, para ${now_year}.`
            }
          } else {
            parametros[0] = req.body.queryResult.parameters['AppointmentType'];
            parametros[1] = req.body.queryResult.parameters['date'];
            parametros[2] = req.body.queryResult.parameters['horas'];
            parametros[3] = req.body.queryResult.parameters['name'];
            parametros[4] = req.body.queryResult.parameters['phone'];

            parametros[5] = projectId;
            parametros[6] = sessionId;

            resposta = await googleCalendar.marcarConsulta( mensagem, parametros );
          }

          break;
        case 'verAgenda':
            parametros[0] = req.body.queryResult.parameters['AppointmentType'];
            parametros[1] = req.body.queryResult.parameters['date'];

      
            console.log('Passou aqui - varAgenda');
            resposta = await googleCalendar.verAgenda( mensagem, parametros );
            break;
        case 'salvarPlanilha':
            parametros[0] = req.body.queryResult.parameters['Dentistas'];
            parametros[1] = req.body.queryResult.parameters['date'];
            parametros[2] = req.body.queryResult.parameters['number'];

            // for (let i = 0; i< parametros.length;i++){
            //       console.log('parametros: ' + parametros[i]);
            //   }
          
            console.log('Passou aqui');
            resposta = await googleSheet.salvarPlanilha( mensagem, parametros );
            break;
        case 'verPlanilha':
            parametros[0] = req.body.queryResult.parameters['date'];
  
            console.log('parametros: ' + parametros[0]);
            resposta = await googleSheet.verPlanilha( mensagem, parametros );
            break;
        case 'teste':
              parametros[0] = req.body.queryResult.parameters['time'];
              let time = new Date(req.body.queryResult.parameters['time']);

              const contexto = req.body.queryResult.outputContexts[0];
              varName = contexto.parameters.name;
              varPhone = contexto.parameters.phone;

              console.log(`varName1: ${varName}`);
              console.log(`varPhone1: ${varPhone}`);


              varName = req.body.queryResult.outputContexts[0].parameters.name;
              varPhone = req.body.queryResult.outputContexts[0].parameters.phone;

  
              console.log(`varName2: ${varName}`);
              console.log(`varPhone2: ${varPhone}`);
  


              //console.log('module', module);
              //console.log('exports', exports);

              //functions.digaOi();
              //let inputContexts = request.body.queryResult.contexts;

              //console.log(request.body.queryResult.contexts[0]);
              //console.log(request.body.queryResult.outputContexts[1]);
              //console.log(request.body.queryResult.contexts[2]);

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

app.listen(porta, () => {
    console.log(`Servidor rodando em: https://${hostname}:${porta}`); // concatenação com crase (`)
})