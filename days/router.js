var express = require('express');
var moment = require('moment');
var router = express.Router();
let datas = require('../datas')

// middleware that is specific to this router
// router.use(function timeLog(req, res, next) {
//   console.log('Time: ', Date.now());
//   next();
// });
// define the home page route

router.get('/', function(req, res) {
  res.json(datas.days);
});

router.get('/:id', function(req, res) {
  let filt = datas.days.filter(day => day.index == req.params.id)
  res.json(filt);
});

router.get('/day/createtoday', function(req, res) {
  let today = moment().format("L")
  let index = datas.days[datas.days.length-1] != undefined ? datas.days[datas.days.length-1].index+1 : 1
  if (datas.days.filter(day => day.date == today).length <= 0) {
    datas.days.push(
      {
        "index": index,
        "date": today
      }
    )
    res.json(datas.days);
  }else{
    res.send('Cette journée existe déjà', 409)
  }
});

router.post('/', function(req, res) {
  if (req.body.date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
    if (datas.days.filter(day => day.date == req.body.date).length <= 0) {
      let index = datas.days[datas.days.length-1] != undefined ? datas.days[datas.days.length-1].index+1 : 1
      datas.days.push(
        {
          "index": index,
          "date": req.body.date
        }
      )
      // console.log(datas.days);
      res.json(req.body);
    }else{
      res.send('Cette journée existe déjà', 409)
    }
  }else{
    res.send('Date au mauvais format', 422)
  }
});

router.delete('/:id', function(req, res) {
  if(datas.days.filter(day => day.index == req.params.id).length > 0){
    datas.days.splice(datas.days.indexOf(datas.days.filter(day => day.index == req.params.id)[0]));
    let consumptions = datas.consumptions.filter(consumption => consumption.index == req.params.id);
    if (consumptions.length > 0) {
      res.send("La journée a bien été supprimmée avec toutes ses consommations renseignées");
    }else{
      res.send("La journée a bien été supprimmée");
    }
    consumptions.forEach(consumption=>{
      datas.consumptions.splice(datas.consumptions.indexOf(consumption))
    })
  }else{
    res.send("Cett journée n'existe pas", 404)
  }
})

router.patch('/:id', (req, res)=>{
  let day = datas.days.filter(day => day.index == req.params.id);
  if (day.length > 0) {
    if (req.body.date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
      datas.days[datas.days.indexOf(day[0])].date = req.body.date
      res.json(day)
    }else{
      res.send('Date au mauvais format', 422)
    }
  }else{
    res.send("Cette journée n'est pas crée", 404)
  }
});

module.exports = router;