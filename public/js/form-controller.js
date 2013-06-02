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


$("#project_submit_btn").click(function(){
	var formData = Array();
	formData["contributer"]=$("#project_form #contributer").val();
	formData["creator"]=$("#project_form #creator").val();
	formData["description"]=$("#project_form #description").val();
	formData["location"]=$("#project_form #location").val();
	formData["name"]=$("#project_form #name").val();
	formData["url"]=$("#project_form #informationUrl").val();
	formData["api_types"]=Array();
	var apiType = $("#project_form #api_type").val();
	formData["api_types"].push(apiType)
	formData["problems"]=Array();
	$("#project_form #problems ul li").each(function(i,target){
		var item = Array();
		item["problem_id"]=target.val()
		formData["problems"].push(item);
	});
	console.log(formData);
	
	
})