/**
 * Created by Freyk on 26.10.2016.
 */
var fs = require('fs');
var path = require('path');
var file = 'users.json';
var filePath = path.join(nw.App.dataPath, file);
console.log(filePath);
fs.open(filePath, 'wx', function (err, fd) {
    if (err) {
        if (err.code === "EEXIST") {
            console.log('myfile already exists');
            return;
        } else {
            throw err;
        }
    }
    fs.writeFileSync(filePath,'{}');
});

function login() {
    var contents = fs.readFileSync(filePath, 'utf8');
    var users = JSON.parse(contents);
    var inputLogin = document.getElementById('inputLogin').value;
    var inputPassword = document.getElementById('inputPassword').value;
    var user;

    for(var key in users)
    {
        if (!users.hasOwnProperty(key)) continue;
        var tempUser = users[key];

        if(tempUser.login == inputLogin)
        {
            user = tempUser;
            break;
        }
    }
    if (user === undefined)
    {
        alert('Неверный логин или пароль');
    }
    else
    {
        if(user.password == inputPassword)
        {
            sessionStorage.user = user.login;
            document.location.href='dashboard.html';
        }
        else
            alert('Неверный логин или пароль');
    }
}
function test() {
    var pathe = path.join(nw.App.dataPath, 'userReports/');
    console.log(pathe);
    console.log(fs.existsSync(pathe));
}