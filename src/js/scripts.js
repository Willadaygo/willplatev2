/*jslint node: true */
'use strict';

$(function() {

  var example   = require('./modules/example.js').init()

  $('.ocn').addClass('is--visible'); // Hide nav on load

  $(".ocn-switch").on("click",function(e){
    e.preventDefault();
    $(".site").toggleClass("ocn-show-right");

    if ($(".site").hasClass("ocn-show-right")) {
      $(".site__inner").append("<div class='overlay'></div>");
      $(".overlay").on("click", function() {
        $(".site").removeClass("ocn-show-right");
        $(this).remove();
      });
    }

  });

  $(".ocn__sub--toggle").on("click",function(){
    $(this).toggleClass("is--rotated");
    $(".ocn__sub").toggleClass("is--visible");
  });

});