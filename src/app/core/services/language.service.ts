
import { Injectable } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})


export class LanguageService {
  constructor(
     public translate: TranslateService
    , private router: Router)
    {
  }

  langChanged(value) {
    localStorage.setItem('locallanguage', value);
    this.translate.use(value);
    this.router.onSameUrlNavigation = 'reload';
   window.location.reload();
  }

  getLanguage(){
    return  localStorage.getItem('locallanguage');
  }

}
