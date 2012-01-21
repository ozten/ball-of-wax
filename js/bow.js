$(document).ready(function () {
  window.User = {
    email: null,    /* Logged in via BrowserID? */
    hasPayment: true     /* Stripe payment method exists?*/
  };
  $(document).bind('orientationchange', function (e) {
    $.get('orientationchange');
  });
  $(document).bind('pageload', function (e) {
    if (window.email)
      $('.email-address').text(window.email);
  });
/*  $('#track-view').live('swipe', function (e, b, c) {
    alert('swipe ' + b + ' ' + c);
  });*/
  $('#track-view').live('swipeleft', function (e, b, c) {
    //alert('swipeleft ' + b + ' ' + c);
    $('#track-nav > li.active').next().find('a').click();
  });
  $('#track-view').live('swiperight', function (e, b, c) {
    //alert('swiperight ' + b + ' ' + c);
    $('#track-nav > li.active').prev().find('a').click();
  });

  // Every page, Play Tracks clicked -> requires log in
  $('.browser-id').live('click', function (e) {
    e.preventDefault();
    navigator.id.get(function(assertion) {
      if (assertion) {
        $.post("/auth", {assertion: assertion}, function(res) {
          if (res.status && res.status == "okay") {
            window.email = res.email;
            $('.email-address').text(window.email);
            //alert("now you're logged in as: " + res.email);
            $('#login-p').dialog('close');
            // TODO check with mp3 server for ownership
            setTimeout(function () {
              $.mobile.changePage('/licensing/pay.html', {role: 'dialog'});
            }, 1000);
          }
        });
      }
    });
  });

  $('.jp-play').click(function (e) {
    // TODO if we aren't logged in, login
    // else if we aren't authorized, pay
    // else setMedia
  };

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
    var url = $(this).attr('href');
    $(this).parent().addClass('active');
    $('#track-view').load(url);
  });
  $('#track-nav li a:first').click();

  $('#pay-now-btn').live('click', function (e) {
    e.preventDefault();
    if (User.hasPayment) {
       // TODO 26 hardcoded
      $.ajax('/purchase_volume/26', {
        type: 'POST',
        dataType: 'json',
        error: function (data, status, jqXhr) {
          // TODO
          alert(data.error);
        },
        success: function (data, status, jqXhr) {
          // TODO
          dialog.close();
        }
      });
    } else {
      $('#pay-step1-group').hide();
      $('#payment-form').show();
    }
  });



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
        console.log('setting up ', token, ' into ', form$);
        // insert the token into the form so it gets submitted to the server
        form$.append("<input type='hidden' name='stripeToken' value='" + token + "'/>");
        // and submit
        //TODO ajax, returning set User.hasPayment = true;
        form$.get(0).submit();
    }
  }
  /******* end First time, needs payment method */
  /******* returning customer */

  /******* end returning customer */
  /************************* end stripe ************************/
  //$.mobile.changePage('/licensing/pay.html', {role: 'dialog'});
});