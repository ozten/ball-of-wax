$(document).ready(function () {

  $('#track-nav li a').click(function (e) {
    e.preventDefault();
    $(this).parent().parent().find('.active').removeClass('active');
    var url = $(this).attr('href');
    $(this).parent().addClass('active'); 
    $('#track-view').load(url);
  });
  $('#track-nav li a:first').click();
});