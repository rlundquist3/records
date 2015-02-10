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

//Look up input album with Gracenote
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
        console.log(result[0]);
        insertAlbumInDB(result[0]);
    }, Gracenote.BEST_MATCH_ONLY);
}

function insertAlbumInDB(albumInfo) {
    console.log('Inserting ' + albumInfo.album_title);

    var nodeCouchDB = require('node-couchdb');
    var couch = new nodeCouchDB('localhost', 5984);

    var id = albumInfo.album_gnid;

    /*var albumData = querystring.stringify({
        'albumArtist':  albumInfo.album_artist_name,
        'title':        albumInfo.album_title,
        'year':         albumInfo.album_year,
        'genreList':    albumInfo.genre,
        'albumArtUrl':  albumInfo.album_art_url,
        'tracks':       albumInfo.tracks
    });

    var postData = querystring.stringify({
        'msg' : 'Hello World!'
    });

    //console.log(JSON.stringify(albumData));

    var options = {
        port:   5984,
        path:   '/records/' + id,
        method: 'POST',
        //headers: {'Content-Length': albumData.length}
        headers: {'Content-Length': postData.length}
    };

    console.log('xxx');
    console.log(options.toString());

    var req = http.request(options, function(res) {
        console.log('STATUS: ' + res.statusCode);
        console.log('HEADERS: ' + JSON.stringify(res.headers));
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('BODY: ' + chunk);
        });
    });

    console.log('yyy');

    req.on('error', function(e) {
        console.log('problem with request: ' + e.message);
    });

    console.log('zzz');
    //req.write(albumData);
    req.write(postData);
    req.end();*/

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

            console.dir(resData)
    });
}
