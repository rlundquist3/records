var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var dialog = require('dialog');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BrowserWindow({width: 800, height: 600});

  mainWindow.loadUrl('file://' + __dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });

  ipc.on('asynchronous-message', function(event, arg) {
    event.sender.send('asynchronous-reply', 'pong');

    if (arg.split('_')[0] == 'NewAlbum') {
        lookupAlbum(arg);
    }
});

});

function lookupAlbum(arg) {
    var artist = arg.split('_')[1];
    var album = arg.split('_')[2];

    console.log('Looking up ' + artist + '/' + album);
    
    var Gracenote = require("node-gracenote");
    var clientId = "14109952";
    var clientTag = "F48FBFB7B79AD619E2C0128222C2F781";
    var userId = "280442354513484188-CD180418DA64D4311D7FC72B1B48B94C";
    var gracenoteAPI = new Gracenote(clientId, clientTag, userId);
    gracenoteAPI.searchAlbum(artist, album, function(err, result) {
            console.log(result[1]);
    });
}
