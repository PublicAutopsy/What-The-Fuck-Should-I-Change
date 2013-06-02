var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'api',
    password : 'meowmix',
    database: 'api_repo'
});

connection.connect();

exports.index = function(req, res){
  res.render('index', { title: 'Index' });
};

exports.random = function(req, res){
  res.render('random', { title: 'Random' });
};



//Data sets start
exports.datasets = function(req, res){

   
    var jsonObj = [];
    connection.query('SELECT * FROM users', function(err, rows, fields) {
        console.log('The solution is: ', rows[0].username);
    });
    res.render('list_view', { title: 'Datasets' });
};
exports.datasetsAdd = function(req, res){
    res.render('add_view', { title: 'Add a Datasets' });
};
exports.datasetSingle = function(req, res){
    var dataset = req.params.dataset;
    res.render('content_view', { title: 'Single Dataset :' +dataset });
};
//Datasets end



//Projects start
exports.project = function(req, res){

    res.render('list_view', { title: 'Projects' });

};
exports.projectAdd = function(req, res){
    res.render('add_view', { title: 'Add a Projects' });
};
exports.projectSingle = function(req, res){
    var project = req.params.project;
    res.render('content_project_view', { title: 'Single Projects : '+project });
};
//projects end



//problem start
exports.problem = function(req, res){
    res.render('list_view', { title: 'Problems' });
};
exports.problemAdd = function(req, res){
    res.render('add_view', { title: 'Add a Problem' });

};
exports.problemSingle = function(req, res){
    var problem = req.params.problem;
    res.render('content_view', { title: 'Single Problems :'+problem });
};
//problem end

exports.search = function(req, res){
    var keyword = req.params.search;
    res.render('search_view', {title: 'Search Results for '+keyword });
}

