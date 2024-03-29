var mysql      = require('mysql'),
    async      = require('async');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'api',
    password: 'meowmix',
    database: 'api_repo',
    multipleStatements: true
});

connection.connect();

exports.index = function (req, res) {
    res.render('index', { title: 'Index' });
};

exports.toc = function (req, res) {
    res.render('toc', { title: 'Terms of Service' });
};

exports.random = function (req, res) {

    var problem;
    var dataset;
    async.series([
        function(callback){
            var query = "SELECT problems.problem_id, problems.name FROM problems INNER JOIN problems_to_datasets ON problems_to_datasets.problem_id = problems.problem_id ORDER BY RAND() LIMIT 0,1";
            connection.query(query, function(err, rows, fields) {
                if( err )
                {
                    console.log("error: " + err);
                    res.end();
                }
                else
                {
                    problem = {"problem_id": rows[0].problem_id, "name":rows[0].name};
                }

                callback(null, null);
            })
        },
        function(callback){
            var query2 = "SELECT datasets.dataset_id, datasets.name FROM datasets LEFT JOIN problems_to_datasets ON problems_to_datasets.dataset_id = datasets.dataset_id WHERE problems_to_datasets.problem_id = " + problem.problem_id + " ORDER BY RAND() LIMIT 0,1";
            connection.query(query2, function(err, rows, fields) {
                //if( err ) console.log("error: " + err);

                dataset = {"dataset_id": rows[0].dataset_id, "name": rows[0].name};
            })

            callback(null);
        }
    ],
    // optional callback
    function(err, results){
        console.log('render random');
        res.render('random', { title: 'Random', "problem":problem, "dataset":dataset });
    });
};

exports.add = function (req, res) {
    //var dsQuery = 'INSERT INTO datasets ()';
    res.render('add_view', { title: 'Add Content', add : true });
};

//Data sets start
exports.datasets = function(req, res){

    async.series([
        function(callback){
            getDataSet(callback);
        }
    ],
    // optional callback
    function(err, results){
        res.render('list_view', {dataList : results[0], data : true});
    });
};




exports.datasetSingle = function(req, res){
    var dataset = req.params.dataset;
    async.series([
        function(callback){
            getDataSet(callback, dataset);
        }
    ],
    // optional callback
    function(err, results){
        res.render('content_view',{dataList : results[0], data : true});
    });
};



//Projects start
exports.project = function (req, res) {
    async.series([
        function(callback){
            getProjects(callback);
        }
    ],

        // optional callback
        function(err, results){
            res.render('list_view', {projectList : results[0], project : true});
        });

};

exports.projectSingle = function (req, res) {
    var project = req.params.project;
    async.series([
        function(callback){
            getProjects(callback, project);
        }
    ],

        // optional callback
        function(err, results){
            res.render('content_project_view', {projectList : results[0], project : true});
        });

};
//projects end


//problem start
exports.problem = function (req, res) {
    async.series([
        function(callback){
            getProblems(callback);
        }
    ],
        // optional callback
        function(err, results){
            res.render('list_view', {problemList : results[0], problem : true});
        });
};



exports.problemSingle = function (req, res) {
    var problem = req.params.problem;
    async.series([
        function(callback){
            getProblems(callback, problem);
        }
    ],
        // optional callback
        function(err, results){
            res.render('content_view', {problemList : results[0], problem : true});
        });
};
//problem end

exports.search = function (req, res) {
    var keyword = req.params.search;
    res.render('search_view', {title: 'Search Results for ' + keyword });
};

function removeKeys( pObj )
{
    var tempArr = new Array();
    for(var key in pObj) {
        tempArr.push(pObj[key]);
    }
    return tempArr;
}

function getDataSet( callback, id )
{
    var query = 'SELECT datasets.*, datasets_to_api_types.api_type_id, api_types.name AS apiname, users.name AS contributer, creators.name AS creator, projects.project_id, projects.name AS project_name, projects.description AS project_description, problems.problem_id, problems.name AS problem_name, problems.description AS problem_description FROM datasets LEFT JOIN users ON datasets.contributer_id = users.user_id LEFT JOIN creators ON datasets.creator_id = creators.creator_id LEFT JOIN datasets_to_api_types ON datasets_to_api_types.dataset_id = datasets.dataset_id LEFT JOIN api_types ON datasets_to_api_types.api_type_id = api_types.api_type_id LEFT JOIN projects_to_datasets ON projects_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN projects ON projects.project_id = projects_to_datasets.project_id LEFT JOIN problems_to_datasets ON problems_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN problems ON problems.problem_id = problems_to_datasets.problem_id';
    if( id !== undefined ) query += ' WHERE datasets.dataset_id = '+ id;

    connection.query(query, function(err, rows, fields) {
        if( err ) console.log('error: ' + err);

        var holderObj = {};

        if( rows === undefined ) return new Array();
        for( var x = 0; x < rows.length; x++ )
        {
            if( holderObj[rows[x].dataset_id] == null )
            {
                holderObj[rows[x].dataset_id] = rows[x];
                holderObj[rows[x].dataset_id].api_types = {};
                holderObj[rows[x].dataset_id].projects = {};
                holderObj[rows[x].dataset_id].problems = {};

                if( rows[x].api_type_id != null ) holderObj[rows[x].dataset_id].api_types[rows[x].api_type_id] = {"api_type_id": rows[x].api_type_id, "name": rows[x].apiname};
                if( rows[x].project_id != null ) holderObj[rows[x].dataset_id].projects[rows[x].project_id] = {"project_id": rows[x].project_id, "name": rows[x].project_name, "description": rows[x].projectdescription};
                if( rows[x].problem_name != null ) holderObj[rows[x].dataset_id].problems[rows[x].problem_id] = {"problem_id": rows[x].problem_id, "name": rows[x].problem_name, "description": rows[x].problem_description};

                delete holderObj[rows[x].dataset_id].api_type_id;
                delete holderObj[rows[x].dataset_id].apiname;
                delete holderObj[rows[x].dataset_id].project_id;
                delete holderObj[rows[x].dataset_id].project_name;
                delete holderObj[rows[x].dataset_id].project_description;
                delete holderObj[rows[x].dataset_id].problem_id;
                delete holderObj[rows[x].dataset_id].problem_name;
                delete holderObj[rows[x].dataset_id].problem_description;
            }
            else
            {
                if( rows[x].api_type_id != null ) holderObj[rows[x].dataset_id].api_types[rows[x].api_type_id] = {"api_type_id": rows[x].api_type_id, "name": rows[x].apiname};
                if( rows[x].project_id != null ) holderObj[rows[x].dataset_id].projects[rows[x].project_id] = {"project_id": rows[x].project_id, "name": rows[x].project_name, "description": rows[x].projectdescription};
                if( rows[x].problem_name != null ) holderObj[rows[x].dataset_id].problems[rows[x].problem_id] = {"problem_id": rows[x].problem_id, "name": rows[x].problem_name, "description": rows[x].problem_description};
            }
        }


        for(var key in holderObj) {
            holderObj[key].api_types = removeKeys(holderObj[key].api_types);
            holderObj[key].projects = removeKeys(holderObj[key].projects);
            holderObj[key].problems = removeKeys(holderObj[key].problems);
        }

        callback( null, removeKeys(holderObj));
    });
}

function getProjects( callback, id )
{
    var query = 'SELECT projects.*, datasets_to_api_types.api_type_id, api_types.name AS apiname, users.name AS contributer, creators.name AS creator, datasets.dataset_id, datasets.name AS dataset_name, datasets.description AS dataset_description, problems.problem_id, problems.name AS problem_name, problems.description AS problem_description FROM projects LEFT JOIN projects_to_datasets ON projects.project_id = projects_to_datasets.project_id LEFT JOIN datasets ON projects_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN datasets_to_api_types ON datasets_to_api_types.dataset_id = datasets.dataset_id LEFT JOIN api_types ON datasets_to_api_types.api_type_id = datasets_to_api_types.api_type_id LEFT JOIN users ON projects.contributer_id = users.user_id LEFT JOIN creators ON projects.creator_id = creators.creator_id LEFT JOIN problems_to_projects ON problems_to_projects.project_id = projects.project_id LEFT JOIN problems ON problems.problem_id = problems_to_projects.problem_id';
    if( id !== undefined ) query += ' WHERE projects.project_id = '+ id;

    connection.query(query, function(err, rows, fields) {
        if( err ) console.log('error: ' + err);

        var holderObj = {};
        if( rows === undefined ) return new Array();
        for( var x = 0; x < rows.length; x++ )
        {
            if( holderObj[rows[x].project_id] == null )
            {
                holderObj[rows[x].project_id] = rows[x];
                holderObj[rows[x].project_id].datasets = {};
                holderObj[rows[x].project_id].problems = {};

                if( rows[x].dataset_id != null )
                {
                    holderObj[rows[x].project_id].datasets[rows[x].dataset_id] = {"dataset_id": rows[x].dataset_id, "name": rows[x].name, "description": rows[x].dataset_description, "api_types":{} };
                    if( rows[x].api_type_id != null ) holderObj[rows[x].project_id].datasets[rows[x].dataset_id].api_types[rows[x].api_type_id] = {"api_type_id": rows[x].api_type_id, "name": rows[x].apiname};
                }
                if( rows[x].problem_name != null ) holderObj[rows[x].project_id].problems[rows[x].problem_id] = {"problem_id": rows[x].problem_id, "name": rows[x].problem_name, "description": rows[x].problem_description};

                delete holderObj[rows[x].project_id].api_type_id;
                delete holderObj[rows[x].project_id].apiname;
                delete holderObj[rows[x].project_id].problem_id;
                delete holderObj[rows[x].project_id].problem_name;
                delete holderObj[rows[x].project_id].problem_description;
                delete holderObj[rows[x].project_id].dataset_id;
                delete holderObj[rows[x].project_id].dataset_name;
                delete holderObj[rows[x].project_id].dataset_description;
            }
            else
            {
                if( rows[x].dataset_id != null )
                {
                    holderObj[rows[x].project_id].datasets[rows[x].dataset_id] = {"dataset_id": rows[x].dataset_id, "name": rows[x].name, "description": rows[x].dataset_description, "api_types":{} };
                    if( rows[x].api_type_id != null ) holderObj[rows[x].project_id].datasets[rows[x].dataset_id].api_types[rows[x].api_type_id] = {"api_type_id": rows[x].api_type_id, "name": rows[x].apiname};
                }
                if( rows[x].problem_name != null ) holderObj[rows[x].project_id].problems[rows[x].problem_id] = {"problem_id": rows[x].problem_id, "name": rows[x].problem_name, "description": rows[x].problem_description};
            }
        }

        for(var key in holderObj) {
            holderObj[key].datasets = removeKeys(holderObj[key].datasets);

            for(var key2 in holderObj[key].datasets) {
                holderObj[key].datasets[key2].api_types = removeKeys(holderObj[key].datasets[key2].api_types);
            }

            holderObj[key].problems = removeKeys(holderObj[key].problems);
        }

        callback( null, removeKeys(holderObj));
    });
}

function getProblems( callback, id, forDV )
{
    var query = 'SELECT problems.*, datasets_to_api_types.api_type_id, api_types.name AS apiname, users.name AS contributer, creators.name AS creator, datasets.dataset_id, datasets.name AS dataset_name, datasets.description AS dataset_description, projects.project_id, projects.name AS project_name, projects.description AS project_description FROM problems LEFT JOIN problems_to_projects ON problems.problem_id = problems_to_projects.problem_id LEFT JOIN projects ON problems_to_projects.project_id = projects.project_id LEFT JOIN problems_to_datasets ON problems_to_datasets.problem_id = problems.problem_id LEFT JOIN datasets ON problems_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN datasets_to_api_types ON datasets_to_api_types.dataset_id = datasets.dataset_id LEFT JOIN api_types ON api_types.api_type_id = datasets_to_api_types.api_type_id LEFT JOIN users ON projects.contributer_id = users.user_id LEFT JOIN creators ON projects.creator_id = creators.creator_id';
    if( id !== undefined ) query += ' WHERE problems.problem_id = '+ id;

    connection.query(query, function(err, rows, fields) {
        if( err ) console.log('error: ' + err);

        var holderObj = {};
        if( rows === undefined )return new Array();
        for( var x = 0; x < rows.length; x++ )
        {
            if( holderObj[rows[x].problem_id] == null )
            {
                holderObj[rows[x].problem_id] = rows[x];
                holderObj[rows[x].problem_id].datasets = {};
                holderObj[rows[x].problem_id].projects = {};

                if( rows[x].dataset_id != null )
                {
                    holderObj[rows[x].problem_id].datasets[rows[x].dataset_id] = {"dataset_id": rows[x].dataset_id, "name": rows[x].name, "description": rows[x].dataset_description, "api_types":{} };
                    if( rows[x].api_type_id != null ) holderObj[rows[x].problem_id].datasets[rows[x].dataset_id].api_types[rows[x].api_type_id] = {"api_type_id": rows[x].api_type_id, "name": rows[x].apiname};
                }
                if( rows[x].project_name != null ) holderObj[rows[x].problem_id].projects[rows[x].project_id] = {"project_id": rows[x].project_id, "name": rows[x].project_name, "description": rows[x].project_description};

                delete holderObj[rows[x].problem_id].api_type_id;
                delete holderObj[rows[x].problem_id].apiname;
                delete holderObj[rows[x].problem_id].project_id;
                delete holderObj[rows[x].problem_id].project_name;
                delete holderObj[rows[x].problem_id].project_description;
                delete holderObj[rows[x].problem_id].dataset_id;
                delete holderObj[rows[x].problem_id].dataset_name;
                delete holderObj[rows[x].problem_id].dataset_description;
            }
            else
            {
                if( rows[x].dataset_id != null )
                {
                    holderObj[rows[x].problem_id].datasets[rows[x].dataset_id] = {"dataset_id": rows[x].dataset_id, "name": rows[x].name, "description": rows[x].dataset_description, "api_types":{} };
                    if( rows[x].api_type_id != null ) holderObj[rows[x].problem_id].datasets[rows[x].dataset_id].api_types[rows[x].api_type_id] = {"api_type_id": rows[x].api_type_id, "name": rows[x].apiname};
                }
                if( rows[x].project_name != null ) holderObj[rows[x].problem_id].projects[rows[x].project_id] = {"project_id": rows[x].project_id, "name": rows[x].project_name, "description": rows[x].project_description};
            }
        }

        for(var key in holderObj) {
            holderObj[key].datasets = removeKeys(holderObj[key].datasets);

            for(var key2 in holderObj[key].datasets) {
                holderObj[key].datasets[key2].api_types = removeKeys(holderObj[key].datasets[key2].api_types);
            }

            holderObj[key].projects = removeKeys(holderObj[key].projects);
        }

        callback( null, removeKeys(holderObj));
    });
}
