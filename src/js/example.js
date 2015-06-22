'use Strict';

var MODULE = MODULE || {};
MODULE.ajaxer = (function(){

    var cache = {},
        url,
        $container = $('.container'),
        $switcher,
        $loader = $('.header__logo');

    function init() {
        createHistory(window.location.href, document.title);
        uiBinding();
    }

    function updateLink(href) {
        var url = href.split('/');
        $('.menu a').removeClass('is--active');
        $('.menu a[data-page="' + url[3] + '"]').addClass('is--active');
    }

    function createHistory(url, title) {
        if ( history.replaceState ) {
            history.pushState({ path: url }, null, url );
            document.title = title;
        }
    }

    function animate(url, transition) {
        createHistory(url, cache[url].headerTitle);
        $loader.removeClass('is--loading');
        if (transition == 'fade') {
            $switcher.remove();
            $container.append('<div class="switch" style="display:none">' + cache[url].html + '</div>');
            $container.find('.switch').fadeIn();
        } else {
            $switcher.addClass('is--gone');
            setTimeout(function(){
                $switcher.remove();
                $container.append('<div class="switch is--hidden">' + cache[url].html + '</div>');
            }, 300);

            setTimeout(function(){
                $container.find('.switch').show().removeClass('is--hidden');
                MODULE.slider.start();
                MODULE.parallax.start();
                updateLink(url);
            }, 500);
        }
    }

    function loader(url, transition) {
        $loader.addClass('is--loading');
        $switcher = $container.find('.switch');
        $('.menu').removeClass('is--open');
        $('.js__newsletter').removeClass('is--hidden');
        $('.newsletter__form').fadeOut('fast');
        $("html, body").animate({ scrollTop: 0 }, 500);
        var track = url.split('/');
        track.splice(0,3);
        _gaq.push(['_trackPageview', '/' + track.join('/')]);

        if(typeof cache[url] == "undefined"){
            $.ajax({
                url: url,
                success: function(data){
                    var $data = $(data);
                    cache[url] = {
                        headerTitle: $data.filter('title').text(),
                        html: $data.find('.switch').html()
                    };
                    animate(url, transition);
                }
            });
        }else{
            animate(url, transition);
        }
    }

    function uiBinding() {
        $(document).on('click', '[data-ajax]', function(e){
            e.preventDefault();
            $this = $(e.currentTarget);
            loader($this.attr('href'), $this.data('ajax'));
        });
        window.onpopstate = function(e) {
            if (e.state) {
                e.preventDefault();
                loader(e.state.path);
            }
        };
    }

    return {
        init: init
    };

})();

MODULE.ajaxer.init();

MODULE.helpers = (function(){
  var resizeArray = [],
    body = document.body,
    timer;

  function reSize() {
    $( window ).resize(function() {
      $(resizeArray).each(function(id, func){
        func();
      });
    });
  }


  function scrolly() {
    window.addEventListener('scroll', function() {
      clearTimeout(timer);
      if(!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover');
      }

        timer = setTimeout(function(){
          body.classList.remove('disable-hover');
        },500);
    }, false);
  }

  function query() {
    var width = window.innerWidth,
      device = 'small';
    if (width > 720) {
      device = 'laptop';
      if (width > 1250) {
        device = 'desktop';
      }
    }
    return device;
  }

  return {
    resizeArray: resizeArray,
    reSize: reSize,
    query: query
  };
})();

MODULE.helpers.reSize();
//MODULE.helpers.scrolly();

MODULE.newsletter = (function(){
    var $newsletter = $('.js__newsletter'),
        $form = $('.newsletter__form__inputs'),
        $input = $('.newsletter__input'),
        $confirm = $('.ui__confirm'),
        $msg = $('.newsletter__msg');

    function init() {
        uiBinding();
    }

    function uiBinding() {
        $(document).on('click', '.js__newsletter', function(){
            $newsletter.toggleClass('is--hidden');
            $form.parent().fadeToggle('fast');
        });


        $form.submit(function(e) {
            e.preventDefault();

            $.post('/', $(this).serialize()).done( function(data) {

                if (!data.success){
                    $input.fadeOut(function(){
                        $msg.text('Sorry there was an error').fadeIn();
                    });
                    setTimeout(function(){
                        $msg.fadeOut(function(){
                            $input.fadeIn();
                        });
                    }, 4000);
                }else{
                    $confirm.addClass('is--strong');
                    $input.fadeOut(function(){
                        $msg.text('Thank You').fadeIn();
                        setTimeout(function(){
                            $('.newsletter').click();
                            setTimeout(function(){
                                $newsletter.removeClass('js__newsletter');
                            }, 1000);
                        }, 3000);
                    });

                }

            });
        });
    }

    return {
        init: init
    };

})();

MODULE.newsletter.init();

MODULE.parallax = (function(){

    var $parallax = $('.parallax'),
        scrolled,
        $item,
        spacing,
        isWorking = 0;

    function start() {
        $parallax = $('.parallax');
    }

    function init() {
        uiBinding();
    }

    function parallax(){
        scrolled = $(window).scrollTop();
        $parallax.css({
            transform: 'translate3d(0, -' + (scrolled * 0.1)  + 'px,0)'
        });
    }

    function uiBinding() {
        $(window).scroll(function(e){
            parallax();
        });
    }

    return {
        init: init,
        start: start
    };

})();

MODULE.parallax.init();

MODULE.share = (function(){
    var $container = $('.container');


    function init() {
        uiBinding();
    }

    function uiBinding() {
        $container.on("click", ".js__share", function(){
            $(this).toggleClass('is--open');
        });
    }

    return {
        init: init
    };

})();

MODULE.share.init();

MODULE.slider = (function(){
  var twitter__swipe,
    instagram__swipe,
    article__swipe,
    $container = $('.container');


  function start() {
    twitter__swipe = $('.swiper__twitter').swiper({
      pagination: '.swiper__twitter__pagination',
      paginationClickable: true,
      loop: true,
      resizeReInit: true
    });

    instagram__swipe = $('.swiper__instagram').swiper({
      pagination: '.swiper__instagram__pagination',
      paginationClickable: true,
      loop: true,
      resizeReInit: true
    });

    article__swipe = $('.swiper__article').swiper({
      pagination: '.swiper__article__pagination',
      autoplay: 5000,
      paginationClickable: true,
      loop: true,
      resizeReInit: true
    });
  }


  function init() {
    start();
    uiBinding();
  }

  function uiBinding() {
    $container.on('click', '.swiper-controls--prev', function(){
      article__swipe.swipePrev();
    });
    $container.on('click', '.swiper-controls--next', function(){
      article__swipe.swipeNext();
    });
  }

  return {
    init: init,
    start: start
  };

})();

MODULE.slider.init();

MODULE.ui = (function(){
  var $hamburger = $('.menu__hamburger'),
    $menu = $('.menu');


  function init(){
    uiBindings();
  }

  function uiBindings(){
    $hamburger.click(function(){
      $menu.toggleClass('is--open');
    });
  }

  return {
    init: init
  };

})();

MODULE.ui.init();
