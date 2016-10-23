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
            this.domElem.style.backgroundColor = '#f5f5f5';
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
    this.colorPipe = function (point)
    {
        var point1 = this.lastPoint.numb,
            point2 = point.numb,
            pipe = document.getElementById('pipe'+point1+point2) != null ? document.getElementById('pipe'+point1+point2) : document.getElementById('pipe'+point2+point1);
            pipe.style.backgroundColor = 'green';
    };
    this.throwPath = function (newTime) {
        console.log('путь скинулся');
        /* здесь будет функция по скидыванию пути */
        var points = this.points;
        var time = 0;
        if(newTime !== undefined)
            time = newTime * 1000;
        var timerId = setTimeout(function () {
            for (var i = 0; i < points.length; i++)
            {
                if(i == 0)
                {
                    points[i].changeStatus();
                    document.getElementById('pipe'+points[i].numb).style.backgroundColor = 'black';
                }
                else
                {
                    points[i].changeStatus();
                    var pipe = document.getElementById('pipe'+points[i].numb+points[i-1].numb) != null ? document.getElementById('pipe'+points[i].numb+points[i-1].numb) : document.getElementById('pipe'+points[i-1].numb+points[i].numb);
                    pipe.style.backgroundColor = 'black';
                }
            }
        },time);

    };
}

var point0 = new Point(0,[], false, true),
    point1 = new Point(1,[], false, true),
    point2 = new Point(2,[], false, true),
    point3 = new Point(3,[0,4,6],true,false),
    point4 = new Point(4,[3,1,5,7],false,false),
    point5 = new Point(5,[4,2,8],false,false),
    point6 = new Point(6,[3,7],true,false),
    point7 = new Point(7,[4,6,8],false,false),
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
            var pipe = document.getElementById('pipe'+point.numb);
            pathIsStarted = true;
            path = new Path();
            path.startPoint = point;
            path.lastPoint = point;
            path.points.push(point);
            path.isStarted = true;
            point.changeStatus();
            pipe.style.backgroundColor = 'green';
            checkFreePoints(path);
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
                        path.points.push(point);
                        point.changeStatus();
                        path.colorPipe(point);
                        path.lastPoint = point;
                        checkFreePoints(path);
                    }
                    else
                    {
                        pathIsStarted = false;
                        path.points.push(point);
                        point.changeStatus();
                        path.colorPipe(point);
                        path.lastPoint = point;
                        path.throwPath(5);
                        path = {};
                    }
                }
            }
        }
    }
}

function checkFreePoints(path) {
    var lastPoint = path.lastPoint,
        adjacentPoints = path.lastPoint.pointArr,
        boolFreePoints = true;

    for(var i=0; i<adjacentPoints.length; i++)
    {
        var adjacentPoint = points[adjacentPoints[i]];
        if(adjacentPoint.isActivated == false)
            boolFreePoints = false;
    }

    if(boolFreePoints == true)
    {
        path.throwPath();
        path = {};
        pathIsStarted = false;
    }

}
