
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Index' });
};

exports.random = function(req, res){
  res.render('random', { title: 'Random' });
};

//Data sets start
exports.datasets = function(req, res){
    res.render('list_view', { title: 'Datasets' });


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
exports.projectSingle = function(req, res){
    var project = req.params.project;
    res.render('content_view', { title: 'Single Projects : '+project });
};

//projects end

//problem start
exports.problem = function(req, res){
    res.render('list_view', { title: 'Problems' });


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

