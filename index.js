const express = require('express');
var moment = require('moment');
const app = express()
const port = 3000
let datas = require('./datas')
let days = require('./days/router')
let consumptions = require('./consumptions/router')
app.use(express.json());
moment.locale('fr')
//console.log(days.stack);
app.get('/', (req, res) => {
  res.send(datas)
})
app.get('/help', (req, res) => {
  let daysroutes=[]
  let help = [
    "Les dates dans le body des requêtes doivent être sous le format 'JJ/MM/AAAA' ",
    'Voici la liste des routes:',
    {
      'route': '/days',
      'route complète': 'http://localhost:3000/days/',
      'actions': [
        {'get':'get: /days'},
        {'get par id':'get: /days/:index'},
        {'post':'post: /days'},
        {'update':'patch: /days/:index'},
        {'delete':'delete: /days/:index'},
      ],
      'underroutes':[
        {
          'route': '/days/day/createtoday',
          'route complète': 'http://localhost:3000/days/day/createtoday',
          'actions': [
            {"créer la journée d'aujourd'hui": 'get: /days'}
          ] 
        }
      ]
    },
    {
      'route': '/consumptions',
      'route complète': 'http://localhost:3000/consumptions/',
      'actions': [
        {'get':'get: /consumptions'},
        {'get par id':'get: /consumptions/:index'},
        {'post':'post: /consumptions'},
        {'update par id de jour':'patch: /consumptions/:index(de la journée)'},
        {'delete par id de jour':'delete: /consumptions/:index(de la journée)'},
      ],
      'underroutes': [
        {
          'route': '/consumptions/createconsumptionbydayid/:index',
          'route complète': 'http://localhost:3000/consumptions/createconsumptionbydayid/:index',
          'actions': [
            {
              "créer des consommations par index de jour": 'post: /createconsumptionbydayid/:index',
              "spécificités": "Le body doit être un objet, les indexs de propriétés seront les aliments et leur propriété le grammage, exemple: {'pain': '100', 'pomme': '146'}"
            }
          ] 
        },
        {
          'route': '/consumptions/createconsumptionbydate/:date',
          'route complète': 'http://localhost:3000/consumptions/createconsumptionbydate/:date',
          'actions':[
            {
              'créer des consommations par date': 'post: /createconsumptionbydayid/:date',
              'spécificités': "Le body doit être comme la route précédente et la date en paramètre doit être du format 'JJ-MM-AAAA'"
            }
          ]
        }
      ]
    },
    
    
  ]

  res.json(help)
})
app.use('/days', days);
app.use('/consumptions', consumptions);

app.listen(port, () => {
  console.log(`http://localhost:${port}`)
})