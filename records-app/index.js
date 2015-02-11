

(function() {
  var $lookupButton = $('.js-lookup-button');
  var $albumInput = $('.js-album-input');
  var $artistInput = $('.js-artist-input');
  var $addNewRecordDialog = $('.js-add-new-record-dialog');
  var $addRecordButton = $('.js-add-record-button');
  var $tracks = $('.js-tracks');
  var $notes = $('.js-notes');
  var $genres = $('.js-genres');
  var $year = $('.js-year');
  var $album = $('.js-album');
  var $artist = $('.js-artist');
  var $cover = $('.js-cover');
  var $recordDialog = $('.js-record-dialog');
  var $newestAlbumsButton = $('.js-newest-albums-button');
  var $addAlbumButton = $('.js-add-album-button');
  var $albumsMenu = $('.js-albums-menu');
  var $genresMenu = $('.js-genres-menu');
  var $viewListButton = $('.js-view-list-button');
  var $addWishButton = $('.js-add-wish-button');
  var $wishlistMenu = $('.js-wishlist-menu');
  var $wishlistTab = $('.js-wishlist-tab');
  var $genresTab = $('.js-genres-tab');
  var $albumsTab = $('.js-albums-tab');
  var $artistsTab = $('.js-artists-tab');


  $albumsTab.on({'mouseenter': showAlbumsMenu});
  $albumsMenu.on('mouseleave', hideAlbumsMenu);

  function showAlbumsMenu() {
    $albumsMenu.css('bottom', -54);
  }

  function hideAlbumsMenu() {
    $albumsMenu.css('bottom', 0);
  }

  $genresTab.on({'mouseenter': showGenresMenu});
  $genresMenu.on('mouseleave', hideGenresMenu);

  function showGenresMenu() {
    $genresMenu.css('bottom', -162);
  }

  function hideGenresMenu() {
    $genresMenu.css('bottom', 0);
  }

  $wishlistTab.on({'mouseenter': showWishlistMenu});
  $wishlistMenu.on('mouseleave', hideWishlistMenu);

  function showWishlistMenu() {
    $wishlistMenu.css('bottom', -54);
  }

  function hideWishlistMenu() {
    $wishlistMenu.css('bottom', 0);
  }

  $addAlbumButton.on('click', showAddDialog);

  function showAddDialog() {
    $addNewRecordDialog.css('visibility', 'visible');
  }

  //------------------------------------------------------------------------
  //Add to real .js file
  //------------------------------------------------------------------------
  var remote = require('remote');
  var ipc = require('ipc');
  var browserWindow = remote.getCurrentWindow();
  
  $lookupButton.on('click', searchClick);

  var receivedInfo;
  function searchClick() {
      $addNewRecordDialog.css('visibility', 'hidden');

      var artist = document.getElementsByName('artistInput')[0].value;
      var album = document.getElementsByName('albumInput')[0].value;
      ipc.on('asynchronous-reply', function(arg) {
          console.log(arg); // prints "pong"
      });
      ipc.send('asynchronous-message', 'NewAlbum_' + artist + '_' + album);

      $recordDialog.css('visibility', 'visible');
      ipc.on('albumResults', function(albumInfo) {
          receivedInfo = albumInfo;
          $artist.html(albumInfo.album_artist_name);
          $album.html(albumInfo.album_title);
          $year.html(albumInfo.album_year);
          $cover.attr('src', albumInfo.album_art_url);
          $genres.html("");
          for (var i=0; i<albumInfo.genre.length; i++) {
              if (i == albumInfo.genre.length - 1)
                  $genres.append(albumInfo.genre[i].text);
              else
                  $genres.append(albumInfo.genre[i].text + '/');
          }
          $tracks.html("");
          for (var i=0; i<albumInfo.tracks.length; i++)
              $tracks.append('<p>' + albumInfo.tracks[i].track_title + '</p>');
      });
  }

  $addRecordButton.on('click', addClick);

  function addClick() {
      ipc.on('addReply', function(arg) {
          console.log(arg); // prints "pong"
      });
      ipc.send('addAlbum');
  }
})();
