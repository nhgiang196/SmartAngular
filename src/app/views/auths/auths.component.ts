import { Component, OnInit } from '@angular/core';
import { changeColorBody } from 'src/app/app.helpers';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-auths',
  template:` <router-outlet></router-outlet>`
})
export class AuthsComponent implements OnInit{
  constructor(private translate: TranslateService,private langService:LanguageService) {
    translate.use(langService.getLanguage());
   }


  ngOnInit(): void {

  }
  ngAfterViewInit(){
    changeColorBody('gray-bg');
  }
}
