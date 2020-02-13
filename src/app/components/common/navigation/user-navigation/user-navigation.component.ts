import { Component, OnInit, AfterViewInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-user-navigation',
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.css']
})
export class UserNavigationComponent implements OnInit,AfterViewInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
  }

}
