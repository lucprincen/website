/*
	Future Imperfect by HTML5 UP
	html5up.net | @n33co
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/

(function($) {

	$(function() {

		var	$window = $(window),
			$body = $('body'),
			$menu = $('#menu'),
			$sidebar = $('#sidebar'),
			$main = $('#main');
            
        $('.menu-button').on( 'click tap', function(){
            console.log( 'hey!' );
            $('.menu').toggleClass( 'active' );
            $('.menu-button').toggleClass('active');
        })

	


		// IE<=9: Reverse order of main and sidebar.
		//	if (skel.vars.IEVersion <= 9)
		//		$main.insertAfter($sidebar);

    });
})(jQuery);
