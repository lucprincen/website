window.onload = function(){

    var navButton = document.getElementById('navbutton');
    var nav = document.getElementById('mainNav');

    navButton.addEventListener( 'click', function(){
        if (nav.classList.contains('active') ){
            nav.classList.remove('active');
            navButton.classList.remove('active');
        }else{
            nav.classList.add('active');
            navButton.classList.add('active');
        }
    });
}