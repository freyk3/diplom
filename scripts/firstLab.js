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
    this.isActivated = false;
    this.isStart = isStart;
    this.isFinish = isFinish;
    this.changeStatus = function () {
        if(this.isActivated == true)
        {
            this.domElem.style.backgroundColor = 'red';
            this.isActivated = false;
        }
        else
        {
            this.domElem.style.backgroundColor = 'green';
            this.isActivated = true;
        }
    };
    this.domElem = document.getElementById('point'+this.numb);
}
function Path() {
    this.startPoint = {};
    this.lastPoint = {};
    this.points = [];
    this.finishedPoint = {};
    this.isStarted = false;
    this.isFinished = false;
}

var point0 = new Point(0,[], false, true),
    point1 = new Point(1,[], false, true),
    point2 = new Point(2,[], false, true),
    point3 = new Point(3,[0,4,6],true,false),
    point4 = new Point(4,[3,1,5,7],false,false),
    point5 = new Point(5,[4,2,8],false,false),
    point6 = new Point(6,[3,7],true,false),
    point7 = new Point(7,[4,8],false,false),
    point8 = new Point(8,[7,5],false,false);

var points = [point0,point1,point2,point3,point4,point5,point6,point7,point8];
var pathIsStarted = false;
var path;

function activatePoint(numb)
{
    var point = points[numb];
    if(point.isActivated == false)
    {
        if(point.isStart == true && pathIsStarted == false)
        {
            pathIsStarted = true;
            path = new Path();
            path.startPoint = point;
            path.lastPoint = point;
            path.points.push(point);
            path.isStarted = true;
            point.changeStatus();
        }
        else if (pathIsStarted == true)
        {
            var lastPoint = path.lastPoint;
            for (var i=0; i<lastPoint.pointArr.length; i++)
            {
                if((lastPoint.pointArr[i] == numb))
                {
                    if(point.isFinish == false)
                    {
                        path.lastPoint = point;
                        path.points.push(point);
                        point.changeStatus();
                    }
                    else
                    {
                        path = {};
                        pathIsStarted = false;
                        point.changeStatus();
                    }

                }
            }
        }
    }
}
