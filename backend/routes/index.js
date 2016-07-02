var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
/*	request("http://www.baidu.com/", function(err, response, body) {
    // JSON body
	    if(err) { console.log(err); callback(true); return; }
	    //obj = JSON.parse(body);
	    //callback(false, obj);
	    console.log(body);
	});*/
  res.render('index', { title: 'Express' });
});

module.exports = router;
