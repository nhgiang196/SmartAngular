import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
@Component({
  selector: 'app-navigation-admin',
  templateUrl: './navigation-admin.component.html',
  styleUrls: ['./navigation-admin.component.css']
})
export class NavigationAdminComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
  }
}
