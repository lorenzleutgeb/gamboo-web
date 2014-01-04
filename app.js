var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var spdy = require('spdy');
var path = require('path');
var fs = require('fs');

var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.errorHandler());

app.get('/', routes.index);

spdy.createServer({
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem'),
	ciphers: 'ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES128-GCM-SHA256',
	honorCipherOrder: true
}, app).listen(443);

// TODO streamline this into only serving a single HTML file
var legacy = express();
legacy.set('views', path.join(__dirname, 'views'));
legacy.set('view engine', 'jade');
legacy.use(express.favicon());
legacy.use(express.logger('dev'));
legacy.use(express.json());
legacy.use(express.urlencoded());
legacy.use(express.methodOverride());
legacy.use(express.cookieParser('your secret here'));
legacy.use(express.session());
legacy.use(legacy.router);
legacy.use(require('stylus').middleware(path.join(__dirname, 'public')));
legacy.use(express.static(path.join(__dirname, 'public')));

legacy.get('/', function(req, res) {
  res.render('legacy');
});

http.createServer(legacy).listen(80);
