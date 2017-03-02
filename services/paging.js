var authenticationSvc  = require('./authentication'),
    pagingSvc = {};

pagingSvc.getPagingOptions = function(req, hasToken){
    return {
        sort:     { date: -1 },
        offset:   hasPermission(req,'start') ? parseInt(req.params.start) : 0,
        limit:    hasPermission(req,'pagesize') ? parseInt(req.params.pagesize) : 3,
        total :   hasPermission(req,'pagesize') ? parseInt(req.params.pagesize) : 3
    };
};

function hasPermission(req, field){
    var hasToken = authenticationSvc.validToken(req);
    return hasToken && req.params[field] !== undefined && req.params[field] !== null;
}

module.exports = pagingSvc;