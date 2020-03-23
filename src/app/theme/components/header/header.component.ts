import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public languageService: LanguageService,public translate: TranslateService,public authService: AuthService) { }

  ngOnInit() {
  }

  languageChange(value){
    this.languageService.langChanged(value);
  }

  logout(){
    this.authService.logout();
  }

  getLang(){
    return localStorage.getItem('locallanguage');
  }

}
