import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
<<<<<<< HEAD
=======
import { LanguageService } from 'src/app/core/services/language.service';
>>>>>>> 821dabe0c1d05ca210533b6831bfe7393ed75d0e

@Component({
  selector: 'app-inventory',
  template:'<router-outlet></router-outlet>'
})
export class InventoryComponent implements OnInit {

<<<<<<< HEAD
  constructor(private translate: TranslateService) {
    translate.use(localStorage.getItem('locallanguage') || 'en');
  }
=======
  constructor(private translate: TranslateService,private langService:LanguageService) {
    translate.use(langService.getLanguage());
   }
>>>>>>> 821dabe0c1d05ca210533b6831bfe7393ed75d0e

  ngOnInit() {
  }

}
