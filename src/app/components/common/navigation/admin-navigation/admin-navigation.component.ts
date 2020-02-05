import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-admin-navigation',
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.css']
})
export class AdminNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
  }

}
