import { Component, OnInit } from '@angular/core';
import { LanguageService } from 'src/app/core/services/language.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(public languageService: LanguageService,public translate: TranslateService,public authService: AuthService,
    private router: Router
    ) { 
    
    // this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
    //   var reloadpath = location.hash.replace('#', '');
    //   this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
    //     this.router.navigate([reloadpath]));
    // })

  }

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
