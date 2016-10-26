/**
 * Created by Freyk on 26.10.2016.
 */
var fs = require('fs');

function login() {
    var contents = fs.readFileSync('files/users.json', 'utf8');
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
            document.location.href='app.html';
        else
            alert('Неверный логин или пароль');
    }

}