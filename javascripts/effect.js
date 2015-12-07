(function(){
    var togglers, toggleSlider;

    togglers = document.getElementsByClassName('toggler');

    toggleSlider = function toggleSlider(slidee){
        return function(e){
            if (e.target.toggle === undefined) {
                e.target.toggle = 1;
                e.target.innerHTML = '원문 감추기';
            } else {
                e.target.toggle = undefined;
                e.target.innerHTML = '원문 보기';
            }

            if (slidee.classList.contains('opened')) {
                slidee.classList.remove('opened');
                slidee.classList.add('closed');
            } else {
                slidee.classList.remove('closed');
                slidee.classList.add('opened');
            }
        }

    };

    Array.prototype.forEach.call(togglers, function(toggler){
        var slidee = toggler.nextElementSibling;
        toggler.addEventListener('click', toggleSlider(slidee), false);
    });
})();