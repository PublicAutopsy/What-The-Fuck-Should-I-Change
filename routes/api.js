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

//Data sets start
exports.datasets = function(req, res){

    async.series([
        function(callback){
            getDataSet(callback, undefined);
        }
    ],
    function(err, results){

        res.send(results[0]);
    });
};

//Data sets start
exports.meow = function(req, res){
    async.series([
        function(callback){
            getDataSet(callback, undefined, true);
        }
    ],
    function(err, results){
        if( err ) console.log(err);
        else
        {
            if( res.headerSent == undefined ) res.send(results[0]);
        }
    });
};

exports.datasetSingle = function(req, res){
    var dataset = req.params.dataset;
    async.series([
        function(callback){
            getDataSet(callback, dataset, true);
        }
    ],
        // optional callback
        function(err, results){
            res.send(results[0]);
        });
};
//Datasets end


//Projects start
exports.projects = function (req, res) {
    async.series([
        function(callback){
            getProjects(callback);
        }
    ],
        // optional callback
        function(err, results){
            res.send(results[0]);
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
            res.send(results[0]);
        });
};
//projects end


//problem start
exports.problems = function (req, res) {
    async.series([
        function(callback){
            getProblems(callback);
        }
    ],
        // optional callback
        function(err, results){
            res.send(results[0]);
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
            res.send(results[0]);
        });
};
//problem end

function getDataSet( callback, id, forDV )
{
    var query = 'SELECT datasets.*, datasets_to_api_types.api_type_id, api_types.name AS apiname, users.name AS contributer, creators.name AS creator, projects.project_id, projects.name AS project_name, projects.description AS project_description, problems.problem_id, problems.name AS problem_name, problems.description AS problem_description FROM datasets LEFT JOIN users ON datasets.contributer_id = users.user_id LEFT JOIN creators ON datasets.creator_id = creators.creator_id LEFT JOIN datasets_to_api_types ON datasets_to_api_types.dataset_id = datasets.dataset_id LEFT JOIN api_types ON datasets_to_api_types.api_type_id = datasets_to_api_types.api_type_id LEFT JOIN projects_to_datasets ON projects_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN projects ON projects.project_id = projects_to_datasets.project_id LEFT JOIN problems_to_datasets ON problems_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN problems ON problems.problem_id = problems_to_datasets.problem_id';
    if( id !== undefined ) query += ' WHERE datasets.dataset_id = '+ id;

    connection.query(query, function(err, rows, fields) {
        if( err ) console.log('error: ' + err);

        var holderObj = {};

        if( rows === undefined ) return holderObj;
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

        if( forDV )
        {
            var keyless = removeKeys(holderObj);
            var dvObj = {'name': 'datasets', 'size':5000, 'classname':'start', 'children':[]};

            for(var key in holderObj) {
                var problemChild = {"name":"problems", "children":[]};
                for(var problemKey = 0; problemKey < holderObj[key].problems.length; problemKey++)
                {
                    problemChild.children.push( {"name": holderObj[key].problems[problemKey].name, "size": ((holderObj[key].problems[problemKey].votes + 1) * 1000), "classname":"problem"} );
                }
                var projectChild = {"name":"projects", "children":[]};
                for(var projectKey = 0; projectKey <  holderObj[key].projects.length; projectKey++)
                {
                    projectChild.children.push( {"name": holderObj[key].projects[projectKey].name, "size": ((holderObj[key].projects[projectKey].votes + 1) * 1000), "classname":"project"} );
                }

                var parent = {"name": holderObj[key].name, "size": 5000, "classname":"dataset", "children": []};
                parent.children.push(problemChild);
                parent.children.push(projectChild);
                dvObj.children.push(parent);
            }

            callback( null, dvObj);
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

function getProblems( callback, id )
{
    var query = 'SELECT problems.*, datasets_to_api_types.api_type_id, api_types.name AS apiname, users.name AS contributer, creators.name AS creator, datasets.dataset_id, datasets.name AS dataset_name, datasets.description AS dataset_description, projects.project_id, projects.name AS project_name, projects.description AS project_description, projects.votes as project_votes, problems.votes AS problem_votes, datasets.votes AS dataset_votes FROM problems LEFT JOIN problems_to_projects ON problems.problem_id = problems_to_projects.problem_id LEFT JOIN projects ON problems_to_projects.project_id = projects.project_id LEFT JOIN problems_to_datasets ON problems_to_datasets.problem_id = problems.problem_id LEFT JOIN datasets ON problems_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN datasets_to_api_types ON datasets_to_api_types.dataset_id = datasets.dataset_id LEFT JOIN api_types ON api_types.api_type_id = datasets_to_api_types.api_type_id LEFT JOIN users ON projects.contributer_id = users.user_id LEFT JOIN creators ON projects.creator_id = creators.creator_id';
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

exports.problemAdd = function (req, res) {
    var problem = req.body;
    var problem_id;
    var creator_id;
    async.series([
        function(callback){
            var dsAddQuery = "INSERT INTO problems ( contributer_id, description, location, name, url ) ";
            dsAddQuery += "VALUES (" + connection.escape(problem.contributer_id) + "," + connection.escape(problem.description) + "," + connection.escape(problem.location) + "," + connection.escape(problem.name) + "," + connection.escape(problem.url) + ")";
            dsAddQuery = dsAddQuery.replace("'null'", "NULL");
            connection.query(dsAddQuery, function(err, result) {
                if( err )
                {
                    console.log("error: " + err);
                    res.end();
                }
                else
                {
                    problem_id = result.insertId;
                }

                callback(null, null);
            })
        },
        function(callback){
            connection.query("SELECT creator_id FROM creators WHERE name = " + connection.escape(problem.creator), function(err, rows, fields) {
                if( err ) console.log("error: " + err);

                if( rows.length < 1 )
                {
                    connection.query("INSERT INTO creators (name) VALUE (" + connection.escape(problem.creator) + ")", function(err, result) {
                        if( err ) console.log("error: " + err);

                        creator_id = result.insertId;
                        callback(null, null);
                    })
                }
                else
                {
                    creator_id = rows[0].creator_id;
                    callback(null, null);
                }
            })
        },
        function(callback){
            connection.query("UPDATE problems SET creator_id = " + connection.escape(creator_id) + " WHERE problem_id = " + connection.escape(problem_id), function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        },
        function(callback){
            var insertQuery = "INSERT INTO problems_to_datasets (problem_id, dataset_id) VALUES ";

            if( problem.datasets === undefined )
            {
                callback(null, null);
                return;
            }

            for(var i = 0; i < problem.datasets.length; i++ )
            {
                insertQuery += "(" + connection.escape(problem_id) + "," + connection.escape(problem.datasets[i].dataset_id) + ")";
                if( i < problem.datasets.length - 1 ) insertQuery += ",";
            }
            connection.query(insertQuery, function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        }
    ],
        // optional callback
        function(err, results){
            res.send(200, 'hello world');
        });
};

exports.datasetsAdd = function (req, res) {
    var dataset = req.body;
    var dataset_id;
    var creator_id;
    async.series([
        function(callback){
            var dsAddQuery = "INSERT INTO datasets (contributer_id, description, location, name, url) ";
            dsAddQuery += "VALUES (" + connection.escape(dataset.contributer_id) + "," + connection.escape(dataset.description) + "," + connection.escape(dataset.location) + "," + connection.escape(dataset.name) + "," + connection.escape(dataset.url) + ")";
            dsAddQuery = dsAddQuery.replace("'null'", "NULL");

            connection.query(dsAddQuery, function(err, result) {
                if( err ) console.log("error: " + err);

                dataset_id = result.insertId;
                callback(null, null);
            })
        },
        function(callback){
            connection.query("SELECT creator_id FROM creators WHERE name = " + connection.escape(dataset.creator), function(err, rows, fields) {
                if( err ) console.log("error: " + err);

                if( rows.length < 1 )
                {
                    connection.query("INSERT INTO creators (name) VALUE (" + connection.escape(dataset.creator) + ")", function(err, result) {
                        if( err ) console.log("error: " + err);

                        creator_id = result.insertId;
                        callback(null, null);
                    })
                }
                else
                {
                    creator_id = rows[0].creator_id;
                    callback(null, null);
                }
            })
        },
        function(callback){
            connection.query("UPDATE datasets SET creator_id = " + connection.escape(creator_id) + " WHERE dataset_id = " + connection.escape(dataset_id), function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        },
        function(callback){
            if( dataset.problems === undefined)
            {
                callback(null, null);
                return;
            }
            var insertQuery = "INSERT INTO problems_to_datasets (problem_id, dataset_id) VALUES ";
            for(var i = 0; i < dataset.problems.length; i++ )
            {
                insertQuery += "(" + connection.escape(dataset.problems[i].problem_id) + "," + connection.escape(dataset_id) + ")";
                if( i < dataset.problems.length - 1 ) insertQuery += ",";
            }
            connection.query(insertQuery, function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        },
        function(callback){
            var insertQuery = "INSERT INTO datasets_to_api_types (dataset_id, api_type_id) VALUES ";
            for(var i = 0; i < dataset.api_types.length; i++ )
            {
                insertQuery += "(" + dataset_id + "," + connection.escape(dataset.api_types[i].api_type_id) + ")";
                if( i < dataset.api_types.length - 1 ) insertQuery += ",";
            }
            connection.query(insertQuery, function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        }
    ],
        // optional callback
        function(err, results){
            res.send(200, {'meow': 'kjdnjknsdfg'});
            //res.end();
        });
};

exports.upvote = function(req, res){

    var connecter = {
        "data": "datasets",
        "problems": "problems",
        "projects": "projects"
    }

    var type = connecter[req.params.type];
    var id = req.params.id;

    console.log("UPDATE " + connection.escape(type) + " SET votes = votes + 1 WHERE " + connection.escape(type.substr(0, type.length-1)) + "_id = " + connection.escape(id));
    connection.query("UPDATE " + connection.escape(type) + " SET votes = votes + 1 WHERE " + connection.escape(type.substr(0, type.length-2)) + "_id = " + connection.escape(id), function(err, result) {
        if( err ) console.log("error: " + err);

        res.send({'result': 1});
    })
};

exports.projectAdd = function (req, res) {
    var project = req.body;
    var project_id;
    var creator_id;
    async.series([
        function(callback){
            var dsAddQuery = "INSERT INTO projects (contributer_id, creator_id, description, iframe_url, location, name, repository_url) ";
            dsAddQuery += "VALUE (" + connection.escape(project.contributer_id) + ", " + connection.escape(project.creator_id) + ", " + connection.escape(project.description) + ", " + connection.escape(project.iframe_url) + ", " + connection.escape(project.location) + ", " + connection.escape(project.name) + ", " + connection.escape(project.repository_url) + ")";
            dsAddQuery = dsAddQuery.replace("'null'", "NULL");
            connection.query(dsAddQuery, function(err, result) {
                if( err ) console.log("error: " + err);

                project_id = result.insertId;
                callback(null, null);
            })
        },
        function(callback){
            connection.query("SELECT creator_id FROM creators WHERE name = " + connection.escape(project.creator), function(err, rows, fields) {
                if( err ) console.log("error: " + err);

                if( rows.length < 1 )
                {
                    connection.query("INSERT INTO creators (name) VALUE (" + connection.escape(project.creator) + ")", function(err, result) {
                        if( err ) console.log("error: " + err);

                        creator_id = result.insertId;
                        callback(null, null);
                    })
                }
                else
                {
                    creator_id = rows[0].creator_id;
                    callback(null, null);
                }
            })
        },
        function(callback){
            connection.query("UPDATE projects SET creator_id = " + connection.escape(creator_id) + " WHERE project_id = " + connection.escape(project_id), function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        },
        function(callback){
            var insertQuery = "INSERT INTO problems_to_projects (problem_id, project_id) VALUES ";

            if( project.problems === undefined )
            {
                callback(null, null);
                return;
            }
            for(var i = 0; i < project.problems.length; i++ )
            {
                insertQuery += "(" + connection.escape(project.problems[i].problem_id) + "," + connection.escape(project_id) + ")";
                if( i < project.problems.length - 1 ) insertQuery += ",";
            }
            connection.query(insertQuery, function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        },
        function(callback){
            var insertQuery = "INSERT INTO projects_to_datasets (dataset_id, project_id) VALUES ";

            if( project.datasets === undefined )
            {
                callback(null, null);
                return;
            }
            for(var i = 0; i < project.datasets.length; i++ )
            {
                insertQuery += "(" + connection.escape(project.datasets[i].dataset_id) + "," + connection.escape(project_id) + ")";
                if( i < project.datasets.length - 1 ) insertQuery += ",";
            }
            connection.query(insertQuery, function(err, result) {
                if( err ) console.log("error: " + err);

                callback(null, null);
            })
        }

    ],
    function(err, results){
        res.send(200, 'hello world');
    });
};

function removeKeys( pObj )
{
    var tempArr = new Array();
    for(var key in pObj) {
        tempArr.push(pObj[key]);
    }
    return tempArr;
}