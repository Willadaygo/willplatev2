/*jslint node: true */
'use strict';

$(function() {

  var header   = require('./modules/header.js').init()

  // $('.ocn').addClass('is--visible'); // Hide nav on load

  // $(".ocn-menu-button").on("click",function(e){
  //   e.preventDefault();
  //   // $(this).toggleClass("is-active");
  //   $(".site").toggleClass("ocn-show-right");

  //   if ($(".site").hasClass("ocn-show-right")) {
  //     $(".ocn-menu-button").addClass("is-active");
  //     $(".site__inner").append("<div class='overlay'></div>");
  //     $(".overlay").on("click", function() {
  //       $(".site").removeClass("ocn-show-right");
  //       $(this).remove();
  //     });
  //   }
  //   else {
  //     $(".ocn-menu-button").removeClass("is-active");
  //   }

  // });

  // $(".ocn__sub--toggle").on("click",function(){
  //   $(this).toggleClass("is--rotated");
  //   $(".ocn__sub").toggleClass("is--visible");
  // });

});