/**
 * Created by andh on 7/28/16.
 */
var config = require('./config'),
    express = require('express'),
    morgan = require('morgan'),
    compress = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    passport = require('passport'),
    cors = require('cors'); 
// https = require('https'),
// http = require('http'),
// fs = require('fs');
module.exports = function () {
    var app = express();
    app.set('views', './app/views');
    app.set('view engine', 'ejs');

    // var allowCrossDomain = function (req, res, next) {
    //     // if ('OPTIONS' == req.method) {
    //     // res.header('Access-Control-Allow-Origin', '*');
    //     // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    //     // res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    //     // next();
    //     // }
    //     // else {
    //     //     next();
    //     // }

    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    //     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    //     if (req.method === 'OPTIONS') {
    //         console.log('!OPTIONS');
    //         var headers = {};
    //         // IE8 does not allow domains to be specified, just the *
    //         // headers["Access-Control-Allow-Origin"] = req.headers.origin;
    //         headers["Access-Control-Allow-Origin"] = "*";
    //         headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    //         headers["Access-Control-Allow-Credentials"] = false;
    //         headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    //         headers["Access-Control-Allow-Headers"] = "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept";
    //         res.writeHead(200, headers);
    //         res.end();
    //     } else {
    //         //...other requests
    //         next();
    //         console.log("FUCL");
    //     }
    // };

    // app.use(allowCrossDomain);


app.use(cors());
    // app.use(function (req, res, next) {
    //     res.header("Access-Control-Allow-Origin", "*");
    //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //     // res.header("Access-Control-Allow-Methods:", "GET, POST, PUT, DELETE");
    //     next();
    // });
    // //  app.all('/', function(req, res, next) {
    // //      res.header("Access-Control-Allow-Origin", "*");
    // //      res.header("Access-Control-Allow-Headers", "X-Requested-With");
    // //      next();
    // //  });

    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
        console.log('Dev Mode');
    } else if (process.env.NODE_ENV === 'production') {
        app.use(compress());
        console.log('Product Mode');
    }
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    app.use(bodyParser.json());
    app.use(methodOverride());
    app.use(session({
        saveUninitialized: true,
        resave: true,
        secret: config.sessionSecret
    }));

    app.use(express.static('./public'));
    app.use(passport.initialize());
    app.use(passport.session());

    var api = express.Router();
    require('../routes/api')(api);
    app.use('/api', api);
    var secure = express.Router();
    require('../routes/index')(secure);
    app.use('/', secure);

    app.set('port', (process.env.PORT || config.server.port));

    app.listen(app.get('port'), function () {
        console.log('Node app is running on port', app.get('port'));
    });

    return app;
}
