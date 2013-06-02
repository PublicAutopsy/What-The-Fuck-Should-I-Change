$("#info_window .close_btn").click(function(){
	if (parseInt($("#info_window").css("right")) == 0){
		$("#info_window").animate({"right":"-50%"});
	} else {
		$("#info_window").animate({"right":"0%"});
	}
})