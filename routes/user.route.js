var express = require('express'),
 		router = express.Router(),
 		bcrypt = require('bcrypt-nodejs'),
		User = require('../models/user.model.js'),
		authentication = require('../services/authentication'),
		LINQ = require('node-linq').LINQ;

/* GET /user listing. */
router.get('/', function(req, res, next) {

	if(!authentication.validToken(req)){
		res.json(null);
	}else {
		User.find(function (err, users) {
			if (err) return next(err);
			var result = new LINQ(users).Select(function(user) {return user.ModelToBaseDto()}).ToArray();
			res.json(result);
		});
	}
});

router.get('/:username/:password', function(req, res, next) {
	User.findOne({ username : req.params.username},function (err, user) {
		if (err || user == null) return next(err);
		user.verifyPassword(req.params.password, function(err, isMatch) {
			if (isMatch) {
				res.json(user.ModelToDto());
			} else {
				res.json(null);
			}
		});
	});
});

router.get('/:user_id', function(req, res, next) {
	if (!authentication.validToken(req)) {
		res.json(null);
	} else {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			res.json(user);
		});
	}
});

/* POST /user */
router.post('/', function(req, res, next) {
	User.create(req.body, function (err, post) {
		if (err) return next(err);
		res.json(post);
	});
});

router.put('/:user_id', function(req, res, next) {
	if(!authentication.validToken(req)) {
		res.json(null);
	}else {
		User.findOneAndUpdate(req.params.user_id, function(err, user) {
			if (err) res.send(err);
			res.json(user);
		});
	}
});

module.exports = router;
