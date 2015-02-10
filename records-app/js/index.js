var remote = require('remote');
var ipc = require('ipc');
var browserWindow = remote.getCurrentWindow();

(function() {
  var $lookupButton = $('.js-lookup-button');
  var $albumInput = $('.js-album-input');
  var $artistInput = $('.js-artist-input');
  var $addNewRecordDialog = $('.js-add-new-record-dialog');
  var $addRecordButton = $('.js-add-record-button');
  var $notes = $('.js-notes');
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

  $lookupButton.on('click', searchClick);

  function searchClick() {
      var artist = document.getElementsByName('artistInput')[0].value;
      var album = document.getElementsByName('albumInput')[0].value;
      ipc.on('asynchronous-reply', function(arg) {
          console.log(arg); // prints "pong"
      });
      ipc.send('asynchronous-message', 'NewAlbum_' + artist + '_' + album);
  }
})();
