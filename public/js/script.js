$(document).ready(function(){
     var apiURL = "/api/sounds";
	$.getJSON(apiURL, function(data) {
		  $.each( data, function() {

			$('#button-box').prepend( '<div class="form-box">'
									+ '<button class="btn-play btn btn-secondary" id="' + this.id + '"><p>' + this.id + ' [' + this.cnt + ']' + '</p></button>'
									+ '<button class="btn-delete btn delete" id="' + this.id + '"><i class="fa fa-trash" aria-hidden="true"></i></button>'
									+ '</div>'

			);
		  	
		  });
	});
    
    
    $('#button-box').on("click", ".btn-play", function(){
        $.ajax({
            url: "/api/play",
            async: false,
            type: "get", //send it through get method
            data: { 
                id: this.id
            }
        });
    });
    
    $('#button-box').on("click", ".btn-delete", function(){
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
