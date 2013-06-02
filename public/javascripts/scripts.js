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

$("#search").click(function(){
    $("#search_box").fadeIn("fast");
    $("#search_field").focus();
    return false;
});
$("#search_close").click(function(){
    $("#search_box").fadeOut("fast");
    return false;
})
