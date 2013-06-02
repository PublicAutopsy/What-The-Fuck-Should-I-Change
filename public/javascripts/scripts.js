$("#search").click(function(){
    $("#search_box").fadeIn("fast");
    $("#search_field").focus();
    $("#search").mouseleave();
    return false;
});
$("#search_close").click(function(){
    $("#search_box").fadeOut("fast");
    return false;
});

$("#info_window .close_btn").click(function(){
    if (parseInt($("#info_window").css("right")) == 0){
        $("#info_window").animate({"right":"-524px"});
        $(".chevron").css("backgroundPosition", "0px center");
    } else {
        $("#info_window").animate({"right":"0px"});
        $(".chevron").css("backgroundPosition", "-49px center");
    }
});

$("#menu_container a").hover(function(e){
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

$("#toAbout").click(function() {
    $('#content').animate({
        scrollTop: $("#second").offset().top
    }, 1500);
});

$("#toContribute").click(function() {
    console.log("Animating");
    $('#content').animate({
        scrollTop: $("#third.page").offset().top + $(window).height()
    }, 1500);
});