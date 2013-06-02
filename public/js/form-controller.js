

 $("#data_form_btn").click(function(){
 	$("#form_selection").remove();
 	$("#add_data").fadeIn();
 });

  $("#project_form_btn").click(function(){
 	$("#form_selection").remove();
 	$("#add_project").fadeIn();
 });

   $("#problem_form_btn").click(function(){
 	$("#form_selection").remove();
 	$("#add_problem").fadeIn();
 });


$("#data_form #problems").change(function(e){
	var selectionVal = $(e.target).val();
	var selectionText = $("#data_form #"+$(e.target).attr("id")+" option[value='"+$(e.target).val()+"']").text();
	console.log("#data_form #"+$(e.target).attr("id")+" option[value='"+$(e.target).val()+"']");
	$("#data_form #problems ul").append("<li id='"+selectionVal+"'>"+selectionText+"</li>")
});

$("#project_form #problem").change(function(e){
	var selectionVal = $(e.target).val();
	var selectionText = $("#project_form #"+$(e.target).attr("id")+" option[value='"+$(e.target).val()+"']").text();
	$("#project_form #problems ul").append("<li id='"+selectionVal+"'>"+selectionText+"</li>")
});

$("#project_form #dataset").change(function(e){
	var selectionVal = $(e.target).val();
	var selectionText = $("#project_form #"+$(e.target).attr("id")+" option[value='"+$(e.target).val()+"']").text();
	$("#project_form #datasets ul").append("<li id='"+selectionVal+"'>"+selectionText+"</li>")
});

$("#problem_form #dataset").change(function(e){
	var selectionVal = $(e.target).val();
	var selectionText = $("#problem_form #"+$(e.target).attr("id")+" option[value='"+$(e.target).val()+"']").text();
	$("#problem_form #datasets ul").append("<li id='"+selectionVal+"'>"+selectionText+"</li>")
});


$("#data_submit_btn").click(function(){
	var formData = {};
	formData["contributer_id"]=$("#data_form #contributor").val();
	formData["creator"]=$("#data_form #creator").val();
	formData["description"]=$("#data_form #description").val();
	formData["location"]=$("#data_form #location").val();
	formData["name"]=$("#data_form #name").val();
	formData["url"]=$("#data_form #informationUrl").val();
	formData["api_types"]= new Array();
	var apiType = $("#data_form #api_type").val();
	formData["api_types"].push({"api_type_id":apiType})
	formData["problems"]= new Array();
	$("#data_form #problems ul li").each(function(i,target){
		var item = Object();
		item["problem_id"]=$(target).attr("id");
		formData["problems"].push(item);
	});

    $.ajax({
        type: "POST",
        url: "/api/data/add",
        data: formData,
        success: function()
        {
            window.location = "/data/"
        }
    })
});

$("#project_submit_btn").click(function(){
	var formData = {};
	formData["contributer_id"]=$("#project_form #contributor").val();
	formData["creator"]=$("#project_form #creator").val();
	formData["description"]=$("#project_form #description").val();
	formData["iframe_url"]=$("#project_form #projectUrl").val();
	formData["location"]=$("#project_form #location").val();
	formData["name"]=$("#project_form #name").val();
	formData["repository_url"]=$("#project_form #repositoryUrl").val();
	formData["url"]=$("#project_form #informationUrl").val();
	formData["datasets"]= new Array();
	$("#project_form #problems ul li").each(function(i,target){
		var item = Object();
		item["dataset_id"]=$(target).attr("id");
		formData["datasets"].push(item);
	});
	formData["problems"]= new Array();
	$("#project_form #problems ul li").each(function(i,target){
		var item = Object();
		item["problem_id"]=$(target).attr("id");
		formData["problems"].push(item);
	});

    $.ajax({
        type: "POST",
        url: "/api/projects/add",
        data: formData,
        success: function()
        {
            window.location = "/projects/"
        }
    })

});


$("#problem_submit_btn").click(function(){
	var formData = {};
	formData["contributer_id"]=$("#problem_form #contributor").val();
	formData["creator"]=$("#problem_form #creator").val();
	formData["description"]=$("#problem_form #description").val();
	formData["location"]=$("#problem_form #location").val();
	formData["name"]=$("#problem_form #name").val();
	formData["url"]=$("#problem_form #projectUrl").val();
	formData["datasets"]=[];
	$("#problem_form #datasets ul li").each(function(i,target){
		var item = Object();
		item["dataset_id"]=$(target).attr("id");
		formData["datasets"].push(item);

	});
    $.ajax({
        type: "POST",
        url: "/api/problems/add",
        data: formData,
        success: function()
        {
            window.location = "/problems/"
        }
    })


});

var dataObj;
var projectsObj;
var problemsObj;
$.get('/api/problems', function(data){
 problemsObj = data;

 $.each(problemsObj, function(i, d){

 	$(".add_form #problem").append("<option value='"+d.problem_id+"'>"+d.name+"</option>")
 });
});
$.get('/api/projects', function(data){
 projectsObj = data;

 $.each(projectsObj, function(i, d){

 	$(".add_form #project").append("<option value='"+d.project_id+"'>"+d.name+"</option>")
 });
});
$.get('/api/datasets', function(data){
 dataObj = data;

 $.each(dataObj, function(i, d){

 	$(".add_form #dataset").append("<option value='"+d.dataset_id+"'>"+d.name+"</option>")
 });
});
