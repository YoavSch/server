var config = require('../bin/config.json'),
		jwt = require('jsonwebtoken'),
		refreshToken = require('jwt-refresh-token'),
		authentication = {};


authentication.validToken = function(req){
	console.log('re ',req);
	if(req.headers === undefined)return false;
	var token =  req.headers.authorization || req.body.token || req.query.token || req.headers['x-access-token'];
	var decoded = false;
	try {
		decoded = jwt.verify(token, config.secret);

	} catch (e) {
		decoded = false;
	}
	return decoded;
};

authentication.updateToken = function(oldToken){
	var options =  {
		expiresIn: '60m',
		algorithm: 'HS256'
	};
	var updatedToken = refreshToken.refresh(oldToken,config.secret,options);
	return updatedToken;
}

module.exports = authentication;
