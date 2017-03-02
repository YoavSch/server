var config = require('../bin/config.json'),
    refreshToken = require('jwt-refresh-token'),
    authentication = require('./authentication'),
    jwt    = require('jsonwebtoken'),
    resSvc = {};

resSvc.response = function(res, data){
    res.set('Authorization', jwt.sign({username: config.secret2}, config.secret,{
        expiresIn: '60m',
        algorithm: 'HS256'
    }));
    res.json(data);
};

module.exports = resSvc;