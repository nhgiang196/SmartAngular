import { Component, OnInit } from '@angular/core';
import { hideSideBar, showNavBar } from 'src/app/app.helpers';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-categories',
  template: `<router-outlet></router-outlet>`
})
export class CategoriesComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.use(localStorage.getItem('locallanguage') || 'en');
  }

  ngOnInit() {
    //showNavBar();
  }

  ngAfterViewInit(): void {
  }

}
