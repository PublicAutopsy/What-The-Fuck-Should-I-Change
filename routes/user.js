exports.signup = function(req, res){
    res.render('index', { title: 'signup' });
};

exports.login = function(req, res){
    res.render('index', { title: 'login' });
};

exports.user = function(req, res){
    var username = req.params.username;
    res.render('index', { title: 'username : '+username });
};