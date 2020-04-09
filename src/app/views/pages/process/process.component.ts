import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-process',
  template:'<router-outlet></router-outlet>'
})
export class ProcessComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.use(localStorage.getItem('locallanguage') || 'en');
   }

  ngOnInit() {
  }

}
