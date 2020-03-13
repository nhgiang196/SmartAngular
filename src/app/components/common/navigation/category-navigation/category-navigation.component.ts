import { Component, OnInit } from '@angular/core';
import { SlimScrollFixSideBar } from 'src/app/app.helpers';
declare var jQuery: any;
@Component({
  selector: 'app-category-navigation',
  templateUrl: './category-navigation.component.html',
  styleUrls: ['./category-navigation.component.css']
})
export class CategoryNavigationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
    SlimScrollFixSideBar();
  }

  
  

}
