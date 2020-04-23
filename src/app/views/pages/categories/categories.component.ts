import { Component, OnInit } from '@angular/core';
import { hideSideBar, showNavBar } from 'src/app/app.helpers';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-categories',
  template: `<router-outlet></router-outlet>`
})
export class CategoriesComponent implements OnInit {

  constructor(private translate: TranslateService,private langService:LanguageService) {
   
  }

  ngOnInit() {
    //showNavBar();
  }

  ngAfterViewInit(): void {
  }

}
