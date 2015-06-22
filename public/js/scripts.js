(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// #Begin example.js
(function(){

  var cache = {},
    url,
    $container = $('.site__inner'),
    $switcher,
    $menuItems = $('.ocn__list .ocn__list__item'),
    $menuLinks = $('.ocn__list a'),
    $headerLink = $('.header a.logo'),
    $mobileLink = $('.book-now a'),
    $sidebarLinks = $('.menu__nav a'),
    $footerLink = $('.footer__list__items--link a');
    var $ajaxLinks = $menuLinks.add($headerLink).add($mobileLink).add($footerLink);

  function init() {
    if ( history.replaceState ) {
      var url = window.location.href;
      history.replaceState({ path: url }, null, url );
      uiBinding();
    }
  }

  function convertToRel(href) {
    href = href.replace('http://', '');
    href = href.replace(window.location.host + '/', '');
    return href;
  }

  function updateLinks(href, target) {
    href = convertToRel(href);
    $menuItems.removeClass('is--active');
    if (target === 'menu') {
      $('a[href="/menus/"]').parent().addClass('is--active');

    } else {
      var activeLink = $('a[href="/' + href + '"]', $menuItems);
      activeLink.closest('.ocn__list__item').addClass('is--active');
    }
    // console.log(activeLink);

  }

  function createHistory(url, title) {
    if ( history.replaceState ) {
      history.pushState({ path: url }, null, url );
      document.title = title;
    }
  }

  function trans(url, target, onpopstate) {
    if (!onpopstate) {
      createHistory(url, cache[url].headerTitle);          
    }
    var $switcherContent = $(cache[url].html);
    
    if ($switcherContent.hasClass('switch-trans')) {
      $switcherContent.addClass('switch-trans-in');
    } else {
      $('.switch-trans', $switcherContent).addClass('switch-trans-in');
    }
    if(target === 'menu') {
      var $newSwitcher = $('<div class="menu__container"></div>');
      var $newContainer = $(document.body).find('.menu-wrapper');
    } else {
      $newSwitcher = $('<div class="switch"></div>');
      $newContainer = $container;
    }
    $newSwitcher.append($switcherContent);
    if(target === 'menu') {
      $('.menu__container').remove();
    } else {
      $('.switch').remove();
    }
    $newContainer.append($newSwitcher);
    $newContainer[0].offsetHeight; // This is to force the dom to redraw with class names before changing again...
    $newContainer.find('.switch-trans').addClass('switch-trans-out');
    updateLinks(url, target);
    $('body').removeClass().addClass(cache[url].bodyClasses);
    // uiContentBinding();
    // switchReady();
  }

  function loader(url, target, onpopstate) {
    if(target === 'menu') {
      $switcher = $('.menu-wrapper').find('.menu__container');
    } else {
      $switcher = $container.find('.switch');
    }
    
    onpopstate = (!onpopstate ? false : true);
    $('.site').removeClass('ocn-show-right');
    $('.overlay').remove();
    $('html, body').animate({ scrollTop: 0 }, 500);
    // var track = url.split('/');
    // track.splice(0,3);
    // Push to Google Analytics...
    // _gaq.push(['_trackPageview', '/' + track.join('/')]);

    // if (typeof cache[url] == "undefined") {
    $.ajax({
      url: url,
      success: function(data){
        var bodyClasses = data.match(/body class=\"(.*?)\"/)[1]; // Necessary as jQuery can't get the body (or body class) from a string
        var $data = $(data);
        if(target === 'menu') {
          var html = $data.find('.menu__container').html();
        } else {
          var html = $data.find('.switch').html();
        }
        cache[url] = {
          headerTitle: $data.filter('title').text(),
          bodyClasses: bodyClasses,
          html: html
        };
        trans(url, target, onpopstate);
      }
    });
      // } else {
      //     trans(url, target, onpopstate);
      // }
  }

  function init()
  {
    uiBinding();
  }

  function uiBinding()
  {
    // $(document.body).on('click', '#sidebar a', function(e){
    //   e.preventDefault();
    //   $('#sidebar a.is--active').removeClass('is--active');
    //   $(this).addClass('is--active');
    //   loader(this.href, 'menu');
    // });
    var $hamburger = $('.ocn-menu-button');

    $ajaxLinks.on('click', function(e){
      e.preventDefault();
      loader(this.href, 'main');
      $hamburger.removeClass('is-active');
      if ($(this).hasClass('js-ocn__sub-toggle')) {
        $('.site').addClass('ocn-show-right');
      }
    });

    $('.ocn').addClass('is--visible'); // Hide nav on load

    $hamburger.on('click',function(e){
      e.preventDefault();

      $('.site').toggleClass('ocn-show-right');

      if ($('.site').hasClass('ocn-show-right')) {
        $hamburger.addClass('is-active');
        $('.site__inner').append('<div class="overlay"></div>');
        $('.overlay').on('click', function() {
          $('.site').removeClass('ocn-show-right');
          $(this).remove();
        });
      }
      else {
        $hamburger.removeClass('is-active');
      }

    });

    $('.js-ocn__sub-toggle').on('click',function(e){
      e.preventDefault();
      $('.ocn__sub').toggleClass('is-open');
    });

  }

  exports.init = init;

})();
// #End example.js
},{}],2:[function(require,module,exports){
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
},{"./modules/header.js":1}]},{},[2]);
