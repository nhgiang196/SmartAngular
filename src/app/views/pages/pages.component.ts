import { Component, OnInit } from '@angular/core';
import { minimalize } from 'src/app/app.helpers';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-pages',
  template: `<app-layout>
 <router-outlet></router-outlet>
  </app-layout>
 `
})
export class PagesComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.use(localStorage.getItem('locallanguage') || 'en');
   }

  ngOnInit() {
  }

  ngAfterViewInit(){
    minimalize();
  }
}
