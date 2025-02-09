
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
    // this.router.onSameUrlNavigation = 'reload';
    // console.log('reload');
  //  window.location.reload();
  }


  getLanguage(){
    let lang = localStorage.getItem('locallanguage');
    if(lang==null || lang =='')
     {
       localStorage.setItem('locallanguage','vn');
      lang ='vn';
     }
    return  lang;
  }

}
