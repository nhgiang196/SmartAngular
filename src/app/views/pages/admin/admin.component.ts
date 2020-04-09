import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
})
export class AdminComponent implements OnInit {

  constructor(private translate: TranslateService) {
    translate.use(localStorage.getItem('locallanguage') || 'en');
  }

  ngOnInit() {
  }

}
