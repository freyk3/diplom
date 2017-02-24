/**
 * Created by Freyk on 28.11.2016.
 */
//Отчет
var fs = require('fs');
var pathToStorage = require('path');
var Docxtemplater = require('docxtemplater');
var JSZip = require('jszip');

var file = 'temp_report_first_vars.json';
var usersFile = 'users.json';
var filePath = pathToStorage.join(nw.App.dataPath, file);
var pathToUsersFile = pathToStorage.join(nw.App.dataPath, usersFile);
var contents = fs.readFileSync(filePath, 'utf8');
var reportObj = JSON.parse(contents);

var usersContents = fs.readFileSync(pathToUsersFile, 'utf8');
var users = JSON.parse(usersContents);
var user;
for(var key in users)
{
    if (!users.hasOwnProperty(key)) continue;
    var tempUser = users[key];

    if(tempUser.login == sessionStorage.user)
    {
        user = tempUser;
        break;
    }
}

//Таймер
var startDate = sessionStorage.timer;
var clocktimer;
var timer = 0;
function startTimer() {
    var thisDate = new Date();
    var t = thisDate.getTime() - startDate;
    var ms = t%1000; t-=ms; ms=Math.floor(ms/10);
    t = Math.floor (t/1000);
    var s = t%60; t-=s;
    t = Math.floor (t/60);
    var m = t%60; t-=m;
    t = Math.floor (t/60);
    var h = t%60;
    if (h<10) h='0'+h;
    if (m<10) m='0'+m;
    if (s<10) s='0'+s;
    if (ms<10) ms='0'+ms;
    document.getElementById('timer').innerText = h + ':' + m + ':' + s + '.' + ms;
    timer = h + ':' + m + ':' + s + '.' + ms;
    clocktimer = setTimeout("startTimer()",10);
}
startTimer();
createLog('Начало мойки');

function Button(numb,str,str2) {
    this.numb = numb;
    this.isPressed = false;
    this.message = str+' наливается...';
    this.name = str;
    this.iName = str2;
}
var button0 = new Button(0,'Холодная вода','холодную воду'),
    button1 = new Button(1,'Щелочь NaOH', 'щелочь NaOH'),
    button2 = new Button(2,'Кислота HNO3', 'кислоту HNO3'),
    button3 = new Button(3,'Дез. раствор', 'дез. раствор'),
    button4 = new Button(4,'Горячая вода', 'горячую воду');
var buttons = [button0,button1,button2,button3,button4];

function launch(numb) {
    var button = buttons[numb];
    var message = document.getElementById('progressText');

    if(isFilling)
    {
        alert('Ожидайте окончания процесса');
    }
    else
    {
        if(button.isPressed)
        {
            createError('Попытка запустить '+button.iName+' повторно');
            alert('Уже запускали');
            return;
        }

        if(numb == 0)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            createLog('Мойка. '+button.message);
            moveBar(0);
        } else if(numb == 1 && button0.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            createLog('Мойка. '+button.message);
            moveBar(1);
        } else if(numb == 2 && button0.isPressed && button1.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            createLog('Мойка. '+button.message);
            moveBar(2);
        } else if(numb == 3 && button0.isPressed && button1.isPressed && button2.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            createLog('Мойка. '+button.message);
            moveBar(3);
        } else if(numb == 4 && button0.isPressed && button1.isPressed && button2.isPressed && button3.isPressed)
        {
            button.isPressed = true;
            message.innerHTML = button.message;
            createLog('Мойка. '+button.message);
            moveBar(4);
        } else
        {
            createError('Ошибка мойки. Попытка пустить '+button.iName+' в неправильной последовательности');
            alert('Неправильно!');
        }
    }

}

function moveBar(numb) {
    var elem = document.getElementById("myBar");
    var width = 1;
    isFilling = true;
    var id = setInterval(frame, 50);
    function frame() {
        if (width >= 100) {
            isFilling = false;
            clearInterval(id);
            if(numb == 4)
            {
                createLog('Окончание мойки. Окончание работы.');
                createReport();
                alert('Работа окончена! Отчет сформирован в разделе "Отчеты"');
                document.location.href='dashboard.html';
            }
        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

function createError(msg) {
    var errorObj = {};
    errorObj.time = timer;
    errorObj.message = msg;
    reportObj.errors.push(errorObj);
}
function createLog(msg) {
    var logObj = {};
    logObj.time = timer;
    logObj.message = msg;
    reportObj.log.push(logObj);
}

function createReport() {
    var content = fs.readFileSync("files/report_template.docx", "binary");
    var zip = new JSZip(content);
    var doc= new Docxtemplater().loadZip(zip);

    var date = new Date;
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    if(month<10)
        month = '0'+month;
    if(day<10)
        day = '0'+day;

    var nowDate = day +'.'+month+'.'+year;
    doc.setData({
        "errors": reportObj.errors,
        "log": reportObj.log,

        "car0.carnumb": reportObj.car0.numbOfCar,
        "car0.kislot": reportObj.car0.kislot,
        "car0.sort": reportObj.car0.sort,
        "car0.clearGroup": reportObj.car0.clearGroup,
        "car0.plotnost": reportObj.car0.plotnost,
        "car0.jir": reportObj.car0.jir,
        "car0.belok": reportObj.car0.belok,
        "car0.t": reportObj.car0.t,
        "car0.tz": reportObj.car0.tz,

        "car1.carnumb": reportObj.car1.numbOfCar,
        "car1.kislot": reportObj.car1.kislot,
        "car1.sort": reportObj.car1.sort,
        "car1.clearGroup": reportObj.car1.clearGroup,
        "car1.plotnost": reportObj.car1.plotnost,
        "car1.jir": reportObj.car1.jir,
        "car1.belok": reportObj.car1.belok,
        "car1.t": reportObj.car1.t,
        "car1.tz": reportObj.car1.tz,

        "car2.carnumb": reportObj.car2.numbOfCar,
        "car2.kislot": reportObj.car2.kislot,
        "car2.sort": reportObj.car2.sort,
        "car2.clearGroup": reportObj.car2.clearGroup,
        "car2.plotnost": reportObj.car2.plotnost,
        "car2.jir": reportObj.car2.jir,
        "car2.belok": reportObj.car2.belok,
        "car2.t": reportObj.car2.t,
        "car2.tz": reportObj.car2.tz,

        "car3.carnumb": reportObj.car3.numbOfCar,
        "car3.kislot": reportObj.car3.kislot,
        "car3.sort": reportObj.car3.sort,
        "car3.clearGroup": reportObj.car3.clearGroup,
        "car3.plotnost": reportObj.car3.plotnost,
        "car3.jir": reportObj.car3.jir,
        "car3.belok": reportObj.car3.belok,
        "car3.t": reportObj.car3.t,
        "car3.tz": reportObj.car3.tz,

        "barrel0.kislot": reportObj.barrel0.kislot,
        "barrel0.sort": reportObj.barrel0.sort,
        "barrel0.clearGroup": reportObj.barrel0.clearGroup,
        "barrel0.plotnost": reportObj.barrel0.plotnost,
        "barrel0.jir": reportObj.barrel0.jir,
        "barrel0.belok": reportObj.barrel0.belok,
        "barrel0.t": reportObj.barrel0.t,
        "barrel0.tz": reportObj.barrel0.tz,

        "barrel1.carnumb": reportObj.barrel1.numbOfCar,
        "barrel1.kislot": reportObj.barrel1.kislot,
        "barrel1.sort": reportObj.barrel1.sort,
        "barrel1.clearGroup": reportObj.barrel1.clearGroup,
        "barrel1.plotnost": reportObj.barrel1.plotnost,
        "barrel1.jir": reportObj.barrel1.jir,
        "barrel1.belok": reportObj.barrel1.belok,
        "barrel1.t": reportObj.barrel1.t,
        "barrel1.tz": reportObj.barrel1.tz,

        "barrel2.carnumb": reportObj.barrel2.numbOfCar,
        "barrel2.kislot": reportObj.barrel2.kislot,
        "barrel2.sort": reportObj.barrel2.sort,
        "barrel2.clearGroup": reportObj.barrel2.clearGroup,
        "barrel2.plotnost": reportObj.barrel2.plotnost,
        "barrel2.jir": reportObj.barrel2.jir,
        "barrel2.belok": reportObj.barrel2.belok,
        "barrel2.t": reportObj.barrel2.t,
        "barrel2.tz": reportObj.barrel2.tz,

        "barrel3.carnumb": reportObj.barrel3.numbOfCar,
        "barrel3.kislot": reportObj.barrel3.kislot,
        "barrel3.sort": reportObj.barrel3.sort,
        "barrel3.clearGroup": reportObj.barrel3.clearGroup,
        "barrel3.plotnost": reportObj.barrel3.plotnost,
        "barrel3.jir": reportObj.barrel3.jir,
        "barrel3.belok": reportObj.barrel3.belok,
        "barrel3.t": reportObj.barrel3.t,
        "barrel3.tz": reportObj.barrel3.tz,

        "report_date": nowDate,

        'user.name': reportObj.user.name,
        'user.surname': reportObj.user.surname,
        'user.group': reportObj.user.group
    });

    doc.render();

    var buf = doc.getZip().generate({type:"nodebuffer"});

    var dirPath = pathToStorage.join(nw.App.dataPath, 'userReports/');
    if(!fs.existsSync(dirPath))
        fs.mkdirSync(dirPath);
    var fileName = reportObj.user.surname+' '+nowDate+' '+date.getTime()+'.docx';
    var reportFile = 'userReports/'+fileName;
    var newReportPath = pathToStorage.join(nw.App.dataPath, reportFile);

    fs.open(newReportPath, 'wx+', function (err, fd) {
        if (err) {
            if (err.code === "EEXIST") {
                console.log('myfile already exists');
                return;
            } else {
                throw err;
            }
        }
        fs.writeFileSync(newReportPath,buf);
    });

    user.reports.push(fileName);
    users[user.login] = user;
    var jsonResponseUsers = JSON.stringify(users);
    fs.writeFileSync(pathToUsersFile,jsonResponseUsers);
}

var isFilling = false;