$(document).ready(function () {

  $(document).bind('orientationchange', function (e) {
    $.get('orientationchange');
  });
  $(document).bind('pageload', function (e) {
    if (window.email)
      $('.email-address').text(window.email);
  });

  $('#track-view').live('swipeleft', function (e, b, c) {
    //alert('swipeleft ' + b + ' ' + c);
    $('#track-nav > li.active').next().find('a').click();
    $("#jquery_jplayer_1").jPlayer('setMedia', {mp3: '/play/volume-26/01_Fatal_Flower_Garden.mp3'});
  });
  $('#track-view').live('swiperight', function (e, b, c) {
    //alert('swiperight ' + b + ' ' + c);
    $('#track-nav > li.active').prev().find('a').click();
  });

  // Every page, Play Tracks clicked -> requires log in
  $('.browser-id').live('click', function (e) {
    e.preventDefault();
    $(this).hide();
    $('#login-progress').show();
    navigator.id.get(function(assertion) {
      if (assertion) {
        $.post("/auth", {assertion: assertion}, function(res) {
          if (res.status && res.status == "okay") {
            User.email = res.email;
            $('.email-address').text(window.email);
            var vol_num = parseInt($('h1').attr('data-volume-num'), 10);
            $('.ui-dialog').dialog('close');
            checkAuth(vol_num);
          }
        });
      }
    });
  });

  $('.jp-play').click(function (e) {
    // TODO if we aren't logged in, login
    // else if we aren't authorized, pay
    // else setMedia
  });

  // tracks hardcoded play with jplayer
    $("#jquery_jplayer_1").jPlayer({
      ready: function () {
        /* TODO hook up as user navigates the app
         and we know they can play a track

          $(this).jPlayer("setMedia", {
          mp3: "/play/volume-25/01_Landed.mp3"
        }); */
      },
      cssSelectorAncestor: '#jp_interface_1',
/*      errorAlerts: true,
      warningAlerts: false, */
      swfPath: "/lib/jQuery.jPlayer.2.1.0/",
      /*solution: "html",*/
      supplied: "mp3"
    });

  // /:volume/tracks landscape switch pages via navigation
  $('#track-nav li a').click(function (e) {
    e.preventDefault();
    $(this).parent().parent().find('.active').removeClass('active');
    var url = $(this).attr('href'),
        mp3url = $(this).attr('data-track');
    if (mp3url) {
      $("#jquery_jplayer_1").jPlayer('setMedia', {mp3: mp3url});
}
    $(this).parent().addClass('active');
    $('#track-view').load(url);
  });
  $('#track-nav li a:first').click();

  $('#pay-now-btn').live('click', function (e) {
    e.preventDefault();
    if (User.hasPayment) {
      $.ajax('/purchase_volume/' + volumeNumber(), {
        type: 'POST',
        dataType: 'json',
        error: function (data, status, jqXhr) {
          // TODO
          alert(data.error);
        },
        success: function (data, status, jqXhr) {
          playCurrent();
        }
      });
    } else {
      $('#pay-step1-group').hide();
      $('#payment-form').show();
    }
  });

  /******************************** mp3 Auth *****************************/
  function volumeNumber () {
    //TODO - make sure this works on all pages
    return parseInt($('h1').attr('data-volume-num'), 10);
  };
  window.User = {
    email: null,    /* Logged in via BrowserID? */
    hasPayment: false,     /* Stripe payment method exists?*/
    vol_auth: {}
  };
  function checkAuth (vol_num) {
    $.ajax('/can/play/volume-' + vol_num, {
        success: function (data, status, jqXhr) {
          if (data.email == null) {
            $.mobile.changePage('/licensing/login', {role: 'dialog'});
            // Wire up navigator.id callback, redo can/play/volume call
          } else {
            User.email = data.email;
            User.vol_auth = data.volumes;
            if (data.can_play == false) {
              $.mobile.changePage('/licensing/pay/' + volumeNumber(), {role: 'dialog'});
              // Wire up pay hooks
            } else {
              // User should be authorized...
              playCurrent();
            }
          }
        }
      });
  }; //checkAuth

  function playCurrent () {
      $('.ui-dialog').dialog('close');
      // TODO Once your authorized, jplayer.setMedia and play are triggered
      // Cover jplayer with a click handler?
      $($('.jp-play').get(0)).trigger('click');
  };
  // States - anonymous -> authenticated -> authorized
  //                                    \-> un-authorzed
  // licensing/pay dialog will walk you through these steps


  $('#mp3-auth').click(function (e) {
    e.preventDefault();
    var vol_num = volumeNumber();
    if (User.email == null ||
        ! User.vol_auth['' + vol_num]) {
      // TODO make ejs
      checkAuth(vol_num);
    } else {
      // User should be authorized...
      playCurrent();
    }
    return false;
  });
  /******************************** end mp3 Auth *****************************/

  /******************************** stripe *******************************/
  /******* First time, needs payment method */
  $("#payment-form").live('submit', function(event) {
    // disable the submit button to prevent repeated clicks

    Stripe.setPublishableKey('pk_iWEPqAvbN0ikmxmfJ99A3uohzegYO');
    $('.submit-button').attr("disabled", "disabled");

    var amount = 500; //amount you want to charge in cents
    Stripe.createToken({
        number: $('.card-number').val(),
        cvc: $('.card-cvc').val(),
        exp_month: $('.card-expiry-month').val(),
        exp_year: $('.card-expiry-year').val()
    }, amount, stripeResponseHandler);

    // prevent the form from submitting with the default action
    return false;
  });
  function stripeResponseHandler(status, response) {
    if (response.error) {
        //show the errors on the form
        $(".payment-errors").html(response.error.message);
    } else {
        var form$ = $("#payment-form");
        // token contains id, last4, and card type
        var token = response['id'];
        // insert the token into the form so it gets submitted to the server
        form$.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
        // and submit
        //TODO ajax, returning set User.hasPayment = true;
        $.ajax(form$.attr('action'), {
               type: 'POST',
               dataType: 'json',
               data: {
                 volume: volumeNumber(),
                 stripeToken: token
               },
               success: function (data, status, jqXhr) {
                 playCurrent();
                },
               error: function (data, status, jqXhr) {
                 $(".payment-errors").html("Unknown Error, please try again later.");
               }
        });

    }
  }
  /******* end First time, needs payment method */
  /******* returning customer */
  $('#pay-now-btn').live('click', function (e) {
    e.preventDefault();
    $.ajax('/purchase_volume/' + $('#pay-volume-number').attr('data-volume-number'), {
      type: 'POST',
      dataType: 'json',
      data: {},
      success: function (data, status, jqXhr) {
        playCurrent();
      },
      error: function (data, status, jqXhr) {
        $(".payment-errors").html("Unknown Error, please try again later.");
      }
    });
    return false;
  });
  /******* end returning customer */
  /************************* end stripe ************************/
  //$.mobile.changePage('/licensing/pay.html', {role: 'dialog'});
});