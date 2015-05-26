/*jslint node: true */
'use strict';

$(document).ready(function() {

  var example   = require('./modules/example').init()

  // #External links
  $('a[data-external="true"]').on('click', function(e) {
    e.preventDefault();

    var href = $(this).attr('href'),
        opener = window.open( href );
  });
  // #End external links

  // #Fastclick Mobile delay
  // #Amended for IE //TG
  // if (window.addEventListener) {
  //  window.addEventListener('load', function() {
  //   new FastClick(document.body);
  //  }, false);
  // }

  // #LazyLoad for events & culture posts
  if( $('.js--lazy').length > 0)
  {
    var offset = 0;
    $('.js--lazy').lazyload({
      load: function(el) {
        setTimeout(function() {
          $(el).addClass('is--loaded');
        }, offset);
        if(offset < 400) {
          offset += 200;
        } else {
          offset = 0;
        } 
      }
    });
  }

});