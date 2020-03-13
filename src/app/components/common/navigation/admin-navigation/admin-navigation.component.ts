import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SlimScrollFixSideBar } from 'src/app/app.helpers';
declare var jQuery: any;
@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.css']
})
export class AdminNavigationComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
    SlimScrollFixSideBar();
  }

}
