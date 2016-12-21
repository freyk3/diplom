/**
 * Created by Freyk on 21.12.2016.
 */
var fs = require('fs');
var pathToStorage = require('path');

var usersFile = 'users.json';
var pathToUsersFile = pathToStorage.join(nw.App.dataPath, usersFile);

var contents = fs.readFileSync(pathToUsersFile, 'utf8');
var users = JSON.parse(contents);
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

for(var i=0; i<user.reports.length; i++)
{
    var reportList = document.getElementById('reports');
    var anch = document.createElement('a');
    anch.innerHTML = user.reports[i];
    anch.setAttribute('href', nw.App.dataPath+'/userReports/'+user.reports[i]);
    anch.setAttribute('download',user.reports[i]);
    reportList.appendChild(anch);
    var br = document.createElement('br');
    reportList.appendChild(br);
}
