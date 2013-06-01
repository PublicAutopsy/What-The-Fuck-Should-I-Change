exports.signup = function(req, res){
    res.render('index', { title: 'signup' });
};

exports.login = function(req, res){
    res.render('index', { title: 'login' });
};

exports.datasets = function(req, res){
    res.render('index', { title: 'Datasets' });

    exports.single = function(req, res){
        var dataset = req.params.dataset;
        res.render('index', { title: 'Single Dataset :' +dataset });
    };
};

exports.project = function(req, res){
    res.render('index', { title: 'Projects' });

    exports.single = function(req, res){
        var project = req.params.project;
        res.render('index', { title: 'Single Projects : '+project });
    };
};

exports.problem = function(req, res){
    res.render('index', { title: 'Problems' });

    exports.single = function(req, res){
        var problem = req.params.problem;
        res.render('index', { title: 'Single Problems :'+problem });
    };
};


exports.user = function(req, res){
    var username = req.params.username;
    res.render('index', { title: 'username : '+username });
};