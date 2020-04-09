import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-example',
  template:'<router-outlet></router-outlet>'
})
export class ExampleComponent implements OnInit {

  constructor(private translate: TranslateService,private langService:LanguageService) {
    translate.use(langService.getLanguage());
   }

  ngOnInit() {
  }

}
