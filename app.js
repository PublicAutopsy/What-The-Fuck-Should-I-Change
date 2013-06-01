var express = require('express')
  , routes = require('./routes')
  , api = require('./routes/api')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'mmm');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/random', routes.random);

app.get('/data', routes.datasets);
app.get('/data/:dataset', routes.datasetSingle);

app.get('/projects', routes.project );
app.get('/projects/:project', routes.projectSingle);

app.get('/problems', routes.problem);
app.get('/problems/:problem', routes.problemSingle);

app.get('/user/signup', user.signup);
app.get('/user/login', user.login);
app.get('/user/:username', user.user);

app.get('/search/:keyword', routes.search);

app.get('/api/projects', api.projects);
app.get('/api/problems', api.problems);
app.get('/api/datasets', api.datasets);





http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
