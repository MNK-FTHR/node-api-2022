var express = require('express');
var router = express.Router();
let datas = require('../datas')

router.get('/', function(req, res) {
  res.json(datas.consumptions);
});

router.get('/:id', function(req, res) {
  let filt = datas.consumptions.filter(consumption => consumption.index == req.params.id)
  res.json(filt);
});

router.post('/', function(req, res) {
  if (Object.keys(req.body).length > 0) {
    if (req.body.hasOwnProperty('index')) {
      if (datas.days.filter(day => day.index == req.body.index).length > 0) {        
        datas.consumptions.push(
          req.body
        )
        res.send(datas.consumptions)
      }else{
        res.send("Cette journée n'est pas crée", 404)
      }
    }else{
      res.send("Ajoutez un index de jour au body", 422)
    }
  }else{
    res.send("Données au mauvais format", 422)
  }
});

router.post('/createconsumptionbydayid/:id', function(req, res){
  if (Object.keys(req.body).length > 0) {
    if (datas.days.filter(day => day.index == req.params.id).length > 0) {
      req.body.index = req.params.id
      datas.consumptions.push(
        req.body
      )
      let selected = datas.days.filter(day => day.index == req.params.id);
      let added = datas.consumptions.filter(consumption => consumption.index == req.params.id)
      selected[0].consumptions = added
      res.send(selected)
    }else{
      res.send("Cette journée n'est pas crée", 404)
    }
  }else{
    res.send("Pas de body...")
  }
});
router.post('/createconsumptionbydate/:date', function(req, res){
  if (Object.keys(req.body).length > 0) {
    if (req.params.date.replace(/[^-]/g, "").length == 2) {
      if (datas.days.filter(day => day.date == req.params.date.replace(/-/gi, '/')).length > 0) {
        req.body.index = datas.days.filter(day => day.date == req.params.date.replace(/-/gi, '/'))[0].index
        datas.consumptions.push(
          req.body
        )
        let selected = datas.days.filter(day => day.date == req.params.date.replace(/-/gi, '/'))[0];
        let added = datas.consumptions.filter(consumption => consumption.index == selected.index)
        selected.consumptions = added
        res.send(selected)
      }else{
        res.send("Cette journée n'est pas crée", 404)
      }
    }else{
      res.send("Date au mauvais format (DD-MM-YYYY)", 422)
    }   
  }else{
    res.send("Données au mauvais format", 422)
  }
});

router.delete('/:id', (req, res)=>{
  let days = datas.days.filter(day => day.index == req.params.id);
  let consumptions = datas.consumptions.filter(consumption => consumption.index == req.params.id);
  if (days.length > 0 && consumptions.length > 0){
    consumptions.forEach(consumption=>{
      datas.consumptions.splice(datas.consumptions.indexOf(consumption))
    })
    res.send("Les consumation pour cette journée ont bien été supprimés")
  }else{
    res.send("Cette journée n'est pas crée", 404)
  }
});
router.patch('/:id', (req, res)=>{
  let day = datas.days.filter(day => day.index == req.params.id);
  if (day.length > 0) {
    let consumptions = datas.consumptions.filter(consumption => consumption.index == req.params.id);
    if (consumptions.length > 0) {
      consumptions.forEach(consumption=>{
        datas.consumptions.splice(datas.consumptions.indexOf(consumption))
      })
      req.body.index = req.params.id;
      datas.consumptions.push(
        req.body
      )
      let selected = datas.days.filter(day => day.index == req.params.id)[0];
      let added = datas.consumptions.filter(consumption => consumption.index == req.params.id)
      console.log(added);
      selected.consumptions = added
      res.json(selected)
    }else{
      res.send('Cette journée ne possède pas de consommations', 404)
    }

  }else{
    res.send("Cette journée n'est pas crée", 404)
  }
});
module.exports = router;