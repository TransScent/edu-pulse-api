exports.cors = function(req, res, next) {
    // This is a stopgap while we figure out wtf we are doing with CORS...
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'OPTIONS,GET,PUT,POST,PATCH,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Ranges, Cache-Control');
    res.header('Access-Control-Expose-Headers', 'Accept-Ranges');
    res.header('Access-Control-Allow-Credentials', true);
    next();
  }