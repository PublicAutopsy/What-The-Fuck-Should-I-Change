$("#info_window .close_btn").click(function(){
	if (parseInt($("#info_window").css("right")) == 0){
		$("#info_window").animate({"right":"-50%"});
	} else {
		$("#info_window").animate({"right":"0%"});
	}
});

$("#menu_container a").hover(function(e){
    console.log(e);
    if(e.type == "mouseenter"){
        var id = $(e.target).attr("id");
        console.log(id);
        $("div.rollover#"+id+"_rollover").animate({left:"60px"},250);

    }
    if(e.type == "mouseleave"){
        var id = $(e.target).attr("id");
        console.log(id);
        $("div.rollover#"+id+"_rollover").animate({left:"-70px"},250);

    }
});