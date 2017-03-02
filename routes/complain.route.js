var express = require('express'),
	router = express.Router(),
	Comaplain = require('../models/complain.model'),
	authentication = require('../services/authentication'),
	User = require('../models/user.model.js'),
	LINQ = require('node-linq').LINQ;

/* GET /user listing. */
router.get('/', function(req, res, next) {
	if (!authentication.validToken(req)) {
		res.json(null);
	}else {
		Comaplain.find(function(err, complains) {
			if (err) return next(err);
			var arrayLength = complains.length;
			var index = 0,
				temp = [];
			new LINQ(complains).Select(function(complain) {
				User.findById(complain.userId, function(err, user) {
					index++;
					temp.push(complain.ModelToDto(user));
					if (index == arrayLength) {
						res.json(temp);
					}
				});
			}).ToArray();
		});
	}
});

/* POST /user */
router.post('/', function(req, res, next) {
	if (!authentication.validToken(req)) {
		res.json(null);
	} else {
		Comaplain.create(req.body, function (err, post) {
			if (err) return next(err);
			res.json(post);
		});
	}
});


module.exports = router;
