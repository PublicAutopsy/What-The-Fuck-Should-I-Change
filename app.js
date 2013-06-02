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
// routes/index.js
app.get('/', routes.index);
app.get('/policies', routes.toc);

app.get('/random', routes.random);

app.get('/add', routes.add);

app.get('/data', routes.datasets);
app.post('/api/data/add', api.datasetsAdd);
app.get('/data/:dataset', routes.datasetSingle);

app.get('/projects', routes.project );
app.post('/api/projects/add', api.projectAdd );
app.get('/projects/:project', routes.projectSingle);

app.get('/problems', routes.problem);
app.post('/api/problems/add', api.problemAdd);
app.get('/problems/:problem', routes.problemSingle);

app.get('/search/:keyword', routes.search);


// routes/user.js
app.get('/user/signup', user.signup);
app.get('/user/login', user.login);
app.get('/user/:username', user.user);



// routes/api.js
app.get('/api/projects', api.projects);
app.get('/api/problems', api.problems);
app.get('/api/datasets', api.datasets);

app.get('/:type/:id/upvote', api.upvote);






http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
