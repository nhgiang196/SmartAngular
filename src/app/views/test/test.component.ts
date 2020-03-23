import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div class="wrapper">
      <div class="ibox-content">
      <hr>GENERAL APP
      <app-customer-editor></app-customer-editor>
      <hr>EDIT FORM type
      <app-form-edit></app-form-edit>
      <hr>CRUD GENERATION
      <app-crud-generation></app-crud-generation>
      <hr>CUSTOMERIZE KEYBOARD NAVIGATION
      <app-customize-keyboard-navigation></app-customize-keyboard-navigation>
      <hr>INFINITE SCROLLING
      <app-infinite-scrolling></app-infinite-scrolling>
      <hr> DISPLAY TEST <app-display-profile></app-display-profile>
      


      <hr> sMART UPLOAD <app-smart-upload ></app-smart-upload>

      <!-- Smart select
		<label for="spc">Special ID</label> 
      <input id="spc" type="text"  #myspecialID> @example: 185 (Factory)
      <button  (click)="myselect=null" >refresh</button>

      <select  #myselect [disabled]="myselect">
        <option value='Item'>Item</option>
        <option value='ItemOut'>ItemOut</option>
        <option value='Factory'>Factory</option>
        <option value='Users'>Users</option>
        <option value='Unit'>Unit</option>
      </select>
      <app-smart-select *ngIf="myselect" [specialId]="myspecialID"  [listName]="myselect"  (select_ngModel)="T = $event"></app-smart-select> -->

      
      <hr>
      </div>
    </div>
  `,
})
export class TestComponent implements OnInit {
  T : any;
  myselect: any;
  myspecialID: any;
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
