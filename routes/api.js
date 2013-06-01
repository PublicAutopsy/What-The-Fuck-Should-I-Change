exports.projects = function(req, res){
    res.render('index', { title: 'projects' });
};

exports.problems = function(req, res){
    res.render('index', { title: 'problems' });
};

exports.datasets = function(req, res){
    res.render('index', { title: 'datasets' });
};