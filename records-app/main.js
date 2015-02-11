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
    mainWindow = new BrowserWindow({width: 1200, height: 800});

    mainWindow.loadUrl('file://' + __dirname + '/index.html');

    mainWindow.on('closed', function() {
        mainWindow = null;
    });

    ipc.on('asynchronous-message', function(event, arg) {
        event.sender.send('asynchronous-reply', 'pong');

        if (arg.split('_')[0] == 'NewAlbum')
            lookupAlbum(arg);
    });

    ipc.on('addAlbum', function(event, arg) {
        event.sender.send('addReply', 'pong');

        insertAlbumInDB();
    });
});

//Look up input album with Gracenote
var albumInfo;

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
        albumInfo = result[0];
        console.log(albumInfo);
        checkAlbum(albumInfo);
    }, Gracenote.BEST_MATCH_ONLY);
}

function checkAlbum(albumInfo) {
    mainWindow.webContents.send('albumResults', albumInfo);
}

function insertAlbumInDB() {
    console.log('Inserting ' + albumInfo.album_title);

    var nodeCouchDB = require('node-couchdb');
    var couch = new nodeCouchDB('localhost', 5984);

    var id = albumInfo.album_gnid;

    couch.insert('records', {
        _id:          id,
        albumArtist:  albumInfo.album_artist_name,
        title:        albumInfo.album_title,
        year:         albumInfo.album_year,
        genreList:    albumInfo.genre,
        albumArtUrl:  albumInfo.album_art_url,
        tracks:       albumInfo.tracks
    }, function (err, resData) {
        if (err)
            return console.error(err);

            console.dir(resData);
    });
}
