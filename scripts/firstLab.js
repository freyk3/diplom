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

function Point(numb,pointArr,isStart,isFinish) {
    this.numb = numb;
    this.pointArr = pointArr;
    this.status = 'off';
    this.isStart = isStart;
    this.isFinish = isFinish;
    this.changeStatus = function () {
        if(this.status == 'on')
        {
            this.status = 'off';
            this.domElem.style.backgroundColor = 'red';
        }
        else
        {
            this.domElem.style.backgroundColor = 'green';
            this.status = 'on';
        }
    };
    this.domElem = document.getElementById('point'+this.numb);
}
var point1 = new Point(1,[], false, true),
    point2 = new Point(2,[], false, true),
    point3 = new Point(3,[], false, true),
    point4 = new Point(4,[1,5,7],true,false),
    point5 = new Point(5,[4,2,6,8],false,false),
    point6 = new Point(6,[5,3,9],false,false),
    point7 = new Point(7,[4,8],true,false),
    point8 = new Point(8,[5,9],false,false),
    point9 = new Point(9,[8,6],false,false);

var points = [point1,point2,point3,point4,point5,point6,point7,point8,point9];

function activatePoint(numb)
{
    for(var i=0; i<points.length; i++)
    {
        if(points[i].numb == numb)
        {
            points[i].changeStatus();
        }
    }
}
