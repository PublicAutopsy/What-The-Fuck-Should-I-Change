
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Index' });
};

exports.random = function(req, res){
  res.render('random', { title: 'Random' });
};

exports.list = function(req, res){
  res.render('index', { title: 'List' });
};

exports.content = function(req, res){
  res.render('index', { title: 'Content' });
};

exports.user = function(req, res){
  res.render('index', { title: 'User' });
};
