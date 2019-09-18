$(document).ready(function(){
	var winHeight = $(window).height();
	console.log("winHeight",winHeight);
	var element = $(".showBox");
	var x = 1;
	$(window).scroll(function(){
		element.each(function(){
			var elm = $(this);
			var winTop =  $(window).scrollTop();

			var topCoord = elm.offset().top;
			if(winTop > (topCoord - (winHeight*0.75)) ){
				$(this).addClass('effect'+x);
				x++;
				if(x == 5){
					x = 1;
				}
			}
		});
	});
});