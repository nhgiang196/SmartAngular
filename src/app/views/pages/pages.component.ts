import { Component, OnInit } from '@angular/core';
import { minimalize } from 'src/app/app.helpers';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-pages',
  template: `<app-layout>
 <router-outlet></router-outlet>
  </app-layout>
 `
})
export class PagesComponent implements OnInit {

  constructor(private translate: TranslateService,private langService:LanguageService) {
   }

  ngOnInit() {
  }

  ngAfterViewInit(){
    minimalize();
  }
}
