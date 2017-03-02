var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../bin/config.json');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
