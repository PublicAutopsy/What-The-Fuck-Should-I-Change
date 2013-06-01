

exports.index = function(req, res){
  res.render('index', { title: 'Index' });
};

exports.random = function(req, res){
  res.render('random', { title: 'Random' });
};



//Data sets start
exports.datasets = function(req, res){
    res.render('index', { title: 'Datasets' });
};
exports.datasetsAdd = function(req, res){
    res.render('index', { title: 'Add a Datasets' });
};
exports.datasetSingle = function(req, res){
    var dataset = req.params.dataset;
    res.render('index', { title: 'Single Dataset :' +dataset });
};
//Datasets end



//Projects start
exports.project = function(req, res){
    res.render('index', { title: 'Projects' });
};
exports.projectAdd = function(req, res){
    res.render('index', { title: 'Add a Projects' });
};
exports.projectSingle = function(req, res){
    var project = req.params.project;
    res.render('index', { title: 'Single Projects : '+project });
};
//projects end



//problem start
exports.problem = function(req, res){
    res.render('index', { title: 'Problems' });
};
exports.problemAdd = function(req, res){
    res.render('index', { title: 'Add a Problem' });
};
exports.problemSingle = function(req, res){
    var problem = req.params.problem;
    res.render('index', { title: 'Single Problems :'+problem });
};
//problem end


