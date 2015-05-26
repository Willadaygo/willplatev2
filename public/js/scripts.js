(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./modules/example":2}],2:[function(require,module,exports){
// #Begin example.js
(function(){

  function init()
  {
      uiBinding();
  }

  function uiBinding()
  {
    // Insert JS here
  }

  exports.init = init;

})();
// #End example.js
},{}]},{},[1]);
