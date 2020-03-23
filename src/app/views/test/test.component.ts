import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div class="wrapper">
      <div class="ibox-content">
      <hr>GENERAL APP
      <app-customer-editor></app-customer-editor>
      <hr>EDIT FORM type 1
      <app-form-edit></app-form-edit>
      <hr>EDIT FORM TYPE 2
      <app-form-edit></app-form-edit>
      <hr>CRUD GENERATION
      <app-crud-generation></app-crud-generation>
      <hr>CUSTOMERIZE KEYBOARD NAVIGATION
      <app-customize-keyboard-navigation></app-customize-keyboard-navigation>
      <hr>INFINITE SCROLLING
      <app-infinite-scrolling></app-infinite-scrolling>
      <hr> DISPLAY TEST
      <app-display-profile></app-display-profile>
      
      <hr>
      </div>
    </div>
  `,
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $('body').addClass('top-navigation');
  }

  ngAfterViewInit() {
    $('#lefNav').hide();
    $('#homeMenuButton').hide();

  }

  ngOnDestroy() {
    $('body').removeClass('top-navigation');
    $('#lefNav').show();
    $('#homeMenuButton').show();

  }
  

}
