var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'api',
    password: 'meowmix',
    database: 'api_repo'
});

connection.connect();

exports.index = function (req, res) {
    res.render('index', { title: 'Index' });
};

exports.random = function (req, res) {
    res.render('random', { title: 'Random' });
};


//Data sets start
exports.datasets = function (req, res) {
    var jsonObj = [];
    connection.query('SELECT * FROM users', function (err, rows, fields) {
        console.log('The solution is: ', rows[0].username);
    });
    res.render('list_view', { title: 'Datasets' });
};
<<<<<<< HEAD
exports.datasetsAdd = function (req, res) {
    res.render('add_view', { title: 'Add a Dataset', data : true });
=======
exports.datasetsAdd = function(req, res){
    res.render('add_view', { title: 'Add a Datasets' });
>>>>>>> a80eac41f7936e4017ffd71de439a44d740a4d21
};
exports.datasetSingle = function (req, res) {
    var dataset = req.params.dataset;
    res.render('content_view', { title: 'Single Dataset :' + dataset });
};
//Datasets end


//Projects start
exports.project = function (req, res) {

    res.render('list_view', { title: 'Projects' });

};
<<<<<<< HEAD
exports.projectAdd = function (req, res) {
    res.render('add_view', { title: 'Add a Projects', project : true });
=======
exports.projectAdd = function(req, res){
    res.render('add_view', { title: 'Add a Projects' });
>>>>>>> a80eac41f7936e4017ffd71de439a44d740a4d21
};
exports.projectSingle = function (req, res) {
    var project = req.params.project;
<<<<<<< HEAD
    res.render('content_view', { title: 'Single Projects : ' + project });
=======
    res.render('content_project_view', { title: 'Single Projects : '+project });
>>>>>>> a80eac41f7936e4017ffd71de439a44d740a4d21
};
//projects end


//problem start
exports.problem = function (req, res) {
    res.render('list_view', { title: 'Problems' });
};
<<<<<<< HEAD
exports.problemAdd = function (req, res) {
    res.render('add_view', { title: 'Add a Problem', problem : true });
=======
exports.problemAdd = function(req, res){
    res.render('add_view', { title: 'Add a Problem' });
>>>>>>> a80eac41f7936e4017ffd71de439a44d740a4d21

};
exports.problemSingle = function (req, res) {
    var problem = req.params.problem;
    res.render('content_view', { title: 'Single Problems :' + problem });
};
//problem end

exports.search = function (req, res) {
    var keyword = req.params.search;
    res.render('search_view', {title: 'Search Results for ' + keyword });
}

