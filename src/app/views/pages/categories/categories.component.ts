import { Component, OnInit } from '@angular/core';
import { hideSideBar, showNavBar } from 'src/app/app.helpers';

@Component({
  selector: 'app-categories',
  template: `<router-outlet></router-outlet>`
})
export class CategoriesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    //showNavBar();
  }

  ngAfterViewInit(): void {
  }

}
