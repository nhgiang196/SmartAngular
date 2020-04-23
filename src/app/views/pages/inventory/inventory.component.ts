import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
  selector: 'app-inventory',
  template:'<router-outlet></router-outlet>'
})
export class InventoryComponent implements OnInit {

  constructor(private translate: TranslateService,private langService:LanguageService) {
   }

  ngOnInit() {
  }

}
