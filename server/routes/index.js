var express = require('express');
var router = express.Router();
var logic = require('../logic/utility.js');


router.get('/', function(req, res, next) {
  res.render('index', { title: 'Do I have Everything?' });
});

// router.post('/submit-trip', function(req, res, next){
//   console.log('test');
//   res.redirect('/pack');
// })



// router.get('/pack', function(req, res, next) {
//   res.render('pack', { title: 'Do I have Everything?' });
// });

module.exports = router;
