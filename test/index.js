var express = require('express')
  , routes = require('./routes')

var app = module.exports = express.createServer();

var logger = function(req, res, next) {
    console.log("Handling request: " + req.url);
    next();
};

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(logger);
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes
app.get('/', routes.index);

app.get('/apicall', function(req, res){
 res.send({
   data: 5
 });
});

//backbone.js integration test support
app.get('/demomodel/:id', function(req, res) {
  res.send({
    id: 1,
    name: 'some guy',
    age: 100
  });
});

app.listen(5000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);


