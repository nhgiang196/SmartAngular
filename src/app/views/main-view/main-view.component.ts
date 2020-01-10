import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.css']
})
export class MainViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').addClass('top-navigation');
    $('#lefNav').hide();
    $('.navbar-header').hide();
  }

  ngOnDestroy(){
    $('body').removeClass('top-navigation');
    $('.navbar-header').show();
  }

}
