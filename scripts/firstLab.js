/**
 * Created by Freyk on 10.10.2016.
 */

function move() {
    var elem = document.getElementById("barIndicator1");
    var height = 1;
    var id = setInterval(frame, 10);
    function frame() {
        if (height >= 100) {
            clearInterval(id);
        } else {
            height++;
            elem.style.height = height + '%';
        }
    }
}