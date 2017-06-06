$(document).ready(function(){
    $(".btn-play").click(function(){
        $.ajax({
            url: "/api/play",
            async: false,
            type: "get", //send it through get method
            data: { 
                id: this.id
            },
            success: function(result){
                console.log(result);
            }
        });
    });
    
    $(".btn-delete").click(function(){
        $.ajax({
            url: "/api/delete",
            async: false,
            type: "get", //send it through get method
            context: this,
            data: { 
                id: this.id
            },
            success: function(result){
                $(this).parent().remove();
            }
        });
    });    
});
