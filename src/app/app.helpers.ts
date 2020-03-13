/*
 * Inspinia js helpers:
 *
 * correctHeight() - fix the height of main wrapper
 * detectBody() - detect windows size
 * smoothlyMenu() - add smooth fade in/out on navigation show/hide
 *
 */

declare var jQuery:any;
declare let $:any;
export function correctHeight() {

  var pageWrapper = jQuery('#page-wrapper');
  var navbarHeight = jQuery('nav.navbar-default').height();
  var wrapperHeigh = pageWrapper.height();

  if (navbarHeight > wrapperHeigh) {
    pageWrapper.css("min-height", navbarHeight + "px");
  }

  if (navbarHeight < wrapperHeigh) {
    if (navbarHeight < jQuery(window).height()) {
      pageWrapper.css("min-height", jQuery(window).height() + "px");
    } else {
      pageWrapper.css("min-height", navbarHeight + "px");
    }
  }

  if (jQuery('body').hasClass('fixed-nav')) {
    if (navbarHeight > wrapperHeigh) {
      pageWrapper.css("min-height", navbarHeight + "px");
    } else {
      pageWrapper.css("min-height", jQuery(window).height() - 60 + "px");
    }
  }
}

export function detectBody() {
  if (jQuery(document).width() < 769) {
    jQuery('body').addClass('body-small')
    jQuery('#navaBarCustom').addClass('navBarCustom')
    
  } else {
    jQuery('body').removeClass('body-small')
    jQuery('#navaBarCustom').removeClass('navBarCustom')
  }
}
// For demo purpose - animation css script
export function animationHover(element, animation) {
    element = $(element);
    element.hover(
        function () {
            element.addClass('animated ' + animation);
        },
        function () {
            //wait for animation to finish before removing classes
            window.setTimeout(function () {
                element.removeClass('animated ' + animation);
            }, 2000);
        });
}
 // Dragable panels
export function WinMove() {
    var element = "[class*=col]";
    var handle = ".ibox-title";
    var connect = "[class*=col]";
    $(element).sortable(
        {
            handle: handle,
            connectWith: connect,
            tolerance: 'pointer',
            forcePlaceholderSize: true,
            opacity: 0.8
        })
        .disableSelection();
}



export function smoothlyMenu() {
  if (!jQuery('body').hasClass('mini-navbar') || jQuery('body').hasClass('body-small')) {
    // Hide menu in order to smoothly turn on when maximize menu
    jQuery('#side-menu').hide();
    // For smoothly turn on menu
    setTimeout(
      function () {
        jQuery('#side-menu').fadeIn(400);
      }, 200);
  } else if (jQuery('body').hasClass('fixed-sidebar')) {
    jQuery('#side-menu').hide();
    setTimeout(
      function () {
        jQuery('#side-menu').fadeIn(400);
      }, 100);
  } else {
    // Remove all inline style from jquery fadeIn function to reset menu state
    jQuery('#side-menu').removeAttr('style');
  }
}
// check if browser support HTML5 local storage
export function localStorageSupport() {
  return (('localStorage' in window) && window['localStorage'] !== null)
}


export function collapseIboxHelper(){
  $('.ibox-tools').on('click', function () {
    var collapse = $(this).find('.collapse-link');
    
    var ibox = $(this).closest('div.ibox');
    var button = collapse.find('i');
    var content = ibox.children('.ibox-content');
    content.slideToggle(200);
    button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
    ibox.toggleClass('').toggleClass('border-bottom');
    setTimeout(function () {
      ibox.resize();
      ibox.find('[id^=map-]').resize();
    }, 50);
  });
  // $('.collapse-link').on('click', function () {
  //   var ibox = $(this).closest('div.ibox');
  //   var button = $(this).find('i');
  //   var content = ibox.children('.ibox-content');
  //   content.slideToggle(200);
  //   button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');
  //   ibox.toggleClass('').toggleClass('border-bottom');
  //   setTimeout(function () {
  //     ibox.resize();
  //     ibox.find('[id^=map-]').resize();
  //   }, 50);
  // });

  // Close ibox function
  $('.close-link').on('click', function () {
    var content = $(this).closest('div.ibox');
    content.remove();
  });
  // Fullscreen ibox function
  $('.fullscreen-link').on('click', function () {
    var ibox = $(this).closest('div.ibox');
    var button = $(this).find('i');
    $('body').toggleClass('fullscreen-ibox-mode');
    button.toggleClass('fa-expand').toggleClass('fa-compress');
    ibox.toggleClass('fullscreen');
    setTimeout(function () {
      $(window).trigger('resize');
    }, 100);
  });
  
}

