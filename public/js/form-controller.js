

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
	$("#data_form #problems ul").append("<li id='"+selectionVal+"'>"+selectionText+"</li>")
});

$("#project_form #problems").change(function(e){
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
	var formData = Object();
	formData["contributer"]=$("#data_form #contributor").val();
	formData["creator"]=$("#data_form #creator").val();
	formData["description"]=$("#data_form #description").val();
	formData["location"]=$("#data_form #location").val();
	formData["name"]=$("#data_form #name").val();
	formData["url"]=$("#data_form #informationUrl").val();
	formData["api_types"]=Array();
	var apiType = $("#data_form #api_type").val();
	formData["api_types"].push({"api_type_id":apiType})
	formData["problems"]=Array();
	$("#data_form #problems ul li").each(function(i,target){
		var item = Object();
		item["problem_id"]=$(target).val()
		formData["problems"].push(item);
	});
	console.log(formData);
	console.log(JSON.stringify(formData));
	
	
});

