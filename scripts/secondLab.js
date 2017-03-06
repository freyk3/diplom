/**
 * Created by Freyk on 28.02.2017.
 */
var correctPipes = [];
var incorrectPipes = [];

function correctAnimation() {
    var id = setInterval(frame, 10);

    function frame() {
        if (tempValue >= newValue) {
            clearInterval(id);
        } else {
            elem.previousElementSibling.innerHTML = tempValue;
            if(tempVar >= percentStep)
            {
                var height = elem.style.height;
                if(height == '')
                    elem.style.height = 1 + '%';
                else
                {
                    var value = elem.style.height;
                    value = value.substring(0, value.length - 1);
                    value = 1 + +value;
                    elem.style.height = value + '%';
                }
            }
        }
    }
}