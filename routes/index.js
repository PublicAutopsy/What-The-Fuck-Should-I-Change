var mysql      = require('mysql'),
    async      = require('async');
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
    getDataSet( res );
};

exports.datasetsAdd = function(req, res){
    res.render('index', { title: 'Add a Datasets' });
};

exports.datasetSingle = function(req, res){
    console.log('meow');
    var dataset = req.params.dataset;
    getDataSet( res, dataset );
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


function removeKeys( pObj )
{
    var tempArr = new Array();
    for(var key in pObj) {
        tempArr.push(pObj[key]);
    }
    return tempArr;
}

function getDataSet( res, id )
{
    var query = 'SELECT datasets.*, datasets_to_api_types.api_type_id, api_types.name AS apiname, users.name AS contributer, creators.name AS creator, projects.project_id, projects.name AS project_name, projects.descritiption AS project_description, problems.problem_id, problems.name AS problem_name, problems.description AS problem_description FROM datasets LEFT JOIN users ON datasets.contributer_id = users.user_id LEFT JOIN creators ON datasets.creator_id = creators.creator_id LEFT JOIN datasets_to_api_types ON datasets_to_api_types.dataset_id = datasets.dataset_id LEFT JOIN api_types ON datasets_to_api_types.api_type_id = datasets_to_api_types.api_type_id LEFT JOIN projects_to_datasets ON projects_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN projects ON projects.project_id = projects_to_datasets.project_id LEFT JOIN problems_to_datasets ON problems_to_datasets.dataset_id = datasets.dataset_id LEFT JOIN problems ON problems.problem_id = problems_to_datasets.problem_id';
    if( id !== undefined ) query += ' WHERE datasets.dataset_id = '+ id;

    console.log( query );

    connection.query(query, function(err, rows, fields) {
        if( err ) console.log('error: ' + err);

        var holderObj = {};
        for( var x = 0; x < rows.length; x++ )
        {
            if( holderObj[rows[x].dataset_id] == null )
            {
                holderObj[rows[x].dataset_id] = rows[x];
                holderObj[rows[x].dataset_id].api_types = {};
                holderObj[rows[x].dataset_id].projects = {};
                holderObj[rows[x].dataset_id].problems = {};

                if( rows[x].api_type_id != null ) holderObj[rows[x].dataset_id].api_types[rows[x].api_type_id] = [{"api_type_id": rows[x].api_type_id, "name": rows[x].apiname}];
                if( rows[x].project_id != null ) holderObj[rows[x].dataset_id].projects[rows[x].project_id] = [{"project_id": rows[x].project_id, "name": rows[x].project_name, "descritiption": rows[x].projectdescritiption}];
                if( rows[x].problem_name != null ) holderObj[rows[x].dataset_id].problems[rows[x].problem_id] = [{"problem_id": rows[x].problem_id, "name": rows[x].problem_name, "descritiption": rows[x].problem_description}];

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
                if( rows[x].api_type_id != null ) holderObj[rows[x].dataset_id].api_types[rows[x].api_type_id] = [{"api_type_id": rows[x].api_type_id, "name": rows[x].apiname}];
                if( rows[x].project_id != null ) holderObj[rows[x].dataset_id].projects[rows[x].project_id] = [{"project_id": rows[x].project_id, "name": rows[x].project_name, "descritiption": rows[x].projectdescritiption}];
                if( rows[x].problem_name != null ) holderObj[rows[x].dataset_id].problems[rows[x].problem_id] = [{"problem_id": rows[x].problem_id, "name": rows[x].problem_name, "descritiption": rows[x].problem_description}];
            }
        }


        for(var key in holderObj) {
            holderObj[key].api_types = removeKeys(holderObj[key].api_types);
            holderObj[key].projects = removeKeys(holderObj[key].projects);
            holderObj[key].problems = removeKeys(holderObj[key].problems);
        }

        res.send(removeKeys(holderObj));
    });
}

