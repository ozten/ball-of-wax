$('#track-nav li a').click(function (e) {
  e.preventDefault();
  var url = $(this).attr('href');
  $('#track-view').load(url);
});