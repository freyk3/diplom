/**
 * Created by Freyk on 10.10.2016.
 */
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
            this.domElem.style.backgroundColor = 'white';
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
            pipe.style.backgroundColor = 'white';
    };
    this.throwPath = function (newTime) {
        console.log('путь скинулся');
        /* здесь будет функция по скидыванию пути */
        var points = this.points;
        var time = 0;
        if(newTime !== undefined)
            time = newTime;
        var timerId = setTimeout(function () {
            for (var i = 0; i < points.length; i++)
            {
                if(i == 0)
                {
                    points[i].changeStatus();
                    document.getElementById('pipe'+points[i].numb).style.backgroundColor = 'rgb(246,144,33)';
                }
                else
                {
                    points[i].changeStatus();
                    var pipe = document.getElementById('pipe'+points[i].numb+points[i-1].numb) != null ? document.getElementById('pipe'+points[i].numb+points[i-1].numb) : document.getElementById('pipe'+points[i-1].numb+points[i].numb);
                    pipe.style.backgroundColor = 'rgb(246,144,33)';
                }
            }
        },time);
    };
    this.provideMilk = function () {
        var litres = prompt('Введите количество литров, которые пойдут в данный танк','');
        var firstPoint = this.points[0].numb;
        var lastPoint = this.points[this.points.length-1].numb;
        var car;
        if(firstPoint == 3)
            car = cars[0];
        else if(firstPoint == 6)
            car = cars[1];
        var barrel = barrels[lastPoint];

        if(car.volume < litres)
        {
            alert('В молоковозе нет столько молока');
        }
        else if(barrel.fullVolume - barrel.value < litres)
        {
            alert('В танк больше не влезет');
        }
        else
        {
            car.volume = car.volume - litres;
            var timeOfFilling = barrel.addMilk(litres);
        }

        this.throwPath(timeOfFilling ? timeOfFilling : '');
        insertCarValue();
    }
}

function Barrel(progressNumb) {
    this.numb = progressNumb;
    this.fullVolume = 200;
    this.value = 0;
    this.progressBar = document.getElementById('barIndicator'+progressNumb);
    this.addMilk = function (litres) {
        var addedPercents = litres * 0.5;
        var elem = this.progressBar;
        var beforeAdd = this.value*0.5;
        var height = beforeAdd;
        var newValue = beforeAdd + addedPercents;
        var animationSpeed = 100;
        var timeOfFilling = (newValue - height) * animationSpeed;

        this.value = this.value + +litres;
        elem.previousElementSibling.innerHTML = this.value;

        var id = setInterval(frame, animationSpeed);
        function frame() {
            if (height >= newValue) {
                clearInterval(id);
            } else {
                height++;
                elem.style.height = height + '%';
            }
        }

        if(this.value > 105) //ну при 105 лпрогресс перекрывает числа, но над этим подумать надо ещё
            elem.previousElementSibling.style.color = 'white';
        else
            elem.previousElementSibling.style.color = 'black';

        return timeOfFilling;
    }
}

function Car(numb) {
    this.numb = numb;
    this.volume = 150;
    this.isActive = false; //приехала машина\ещё не приехала
    this.carVolume = document.getElementById('carVolume'+this.numb);
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
var barrel0 = new Barrel(0),
    barrel1 = new Barrel(1),
    barrel2 = new Barrel(2);
var car0 = new Car(0),
    car1 = new Car(1);

var points = [point0,point1,point2,point3,point4,point5,point6,point7,point8];
var barrels = [barrel0,barrel1,barrel2];
var cars = [car0,car1];
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
            pipe.style.backgroundColor = 'white';
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
                        path.provideMilk();
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

function insertCarValue() {
    for(var i = 0; i<cars.length; i++)
    {
        var car = cars[i];
        car.carVolume.innerText = car.volume;
    }
}

/* Всё что будет происходить сразу после загрузки */
insertCarValue();

