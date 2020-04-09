import { Component, OnInit } from '@angular/core';
import { changeColorBody } from 'src/app/app.helpers';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-auths',
  template:` <router-outlet></router-outlet>`
})
export class AuthsComponent implements OnInit{
  constructor(private translate: TranslateService) {
    translate.use(localStorage.getItem('locallanguage') || 'en');
  }

  
  ngOnInit(): void {

  }
  ngAfterViewInit(){
    changeColorBody('gray-bg');
  }
}
