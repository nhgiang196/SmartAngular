import { Component, OnInit, DoCheck } from '@angular/core';
import { detectBody,smoothlyMenu, collapseIboxHelper } from '../../../../app.helpers';
declare let $: any;
@Component({
  selector: 'basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.css']
})
export class BasicComponent implements OnInit , DoCheck{

  constructor() { }

  ngDoCheck(){
    detectBody();
  }

  ngOnInit() {
    // MetisMenu
    $('#side-menu').metisMenu();
    // Append config box / Only for demo purpose
    // Uncomment on server mode to enable XHR calls
    $.get("assets/skin-config.html", function (data) {
      if (!$('body').hasClass('no-skin-config'))
        $('body').append(data);
    });


    // Full height of sidebar
    function fix_height() {
      var heightWithoutNavbar = $("body > #wrapper").height() - 61;
      $(".sidebar-panel").css("min-height", heightWithoutNavbar + "px");

      var navbarheight = $('nav.navbar-default').height();
      var wrapperHeight = $('#page-wrapper').height();

      if (navbarheight > wrapperHeight) {
        $('#page-wrapper').css("min-height", navbarheight + "px");
      }

      if (navbarheight < wrapperHeight) {
        $('#page-wrapper').css("min-height", $(window).height() + "px");
      }

      if ($('body').hasClass('fixed-nav')) {
        if (navbarheight > wrapperHeight) {
          $('#page-wrapper').css("min-height", navbarheight + "px");
        } else {
          $('#page-wrapper').css("min-height", $(window).height() - 60 + "px");
        }
      }

    }

    fix_height();

    // Fixed Sidebar
    $(window).bind("load", function () {
      if ($("body").hasClass('fixed-sidebar')) {
        $('.sidebar-collapse').slimScroll({
          height: '100%',
          railOpacity: 0.9
        });
      }
    });

    // Move right sidebar top after scroll
    $(window).scroll(function () {
      if ($(window).scrollTop() > 0 && !$('body').hasClass('fixed-nav')) {
        $('#right-sidebar').addClass('sidebar-top');
      } else {
        $('#right-sidebar').removeClass('sidebar-top');
      }
    });

    $(window).bind("load resize scroll", function () {
      if (!$("body").hasClass('body-small')) {
        fix_height();
      }
    });

    $("[data-toggle=popover]")
      .popover(); 

    

    // Close menu in canvas mode
    $('.close-canvas-menu').on('click', function () {
      $("body").toggleClass("mini-navbar");
      smoothlyMenu();
    });


    // Open close right sidebar
    $('.right-sidebar-toggle').on('click', function () {
      $('#right-sidebar').toggleClass('sidebar-open');
    });

    // Initialize slimscroll for right sidebar
    $('.sidebar-container').slimScroll({
      height: '100%',
      railOpacity: 0.4,
      wheelStep: 10
    });

    // Open close small chat
    $('.open-small-chat').on('click', function () {
      $(this).children().toggleClass('fa-comments').toggleClass('fa-remove');
      $('.small-chat-box').toggleClass('active');
    });

    // Initialize slimscroll for small chat
    $('.small-chat-box .content').slimScroll({
      height: '234px',
      railOpacity: 0.4
    });

    // Small todo handler
    $('.check-link').on('click', function () {
      var button = $(this).find('i');
      var label = $(this).next('span');
      button.toggleClass('fa-check-square').toggleClass('fa-square-o');
      label.toggleClass('todo-completed');
      return false;
    });

    
    // Minimalize menu
    $('.navbar-minimalize').on('click', function () {
      $("body").toggleClass("mini-navbar");
     smoothlyMenu();

    });

    // Tooltips demo
    $('.tooltip-demo').tooltip({
      selector: "[data-toggle=tooltip]",
      container: "body"
    });


  }

  ngAfterViewInit(){
    
    
  }

}
