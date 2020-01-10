import { Component, OnInit } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Router } from '@angular/router';

declare var jQuery: any;

@Component({
  selector: 'topnavbar',
  templateUrl: './topnavbar.component.html',
  styleUrls: ['./topnavbar.component.css']
})
export class TopnavbarComponent implements OnInit {

  constructor(private authService: AuthService
   // , public engineApi: EngineService
    , public translate: TranslateService
    , private router: Router) {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      var reloadpath = location.hash.replace('#', '');
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
        this.router.navigate([reloadpath]));
    })
  }



  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }
  ngOnInit() {
    // this.allTasks();
  }


  langChanged(value) {
    localStorage.setItem('locallanguage', value);
    window.location.reload();
    // this.translate.use(value);
    
  }
  logOut() {
    this.authService.logout();
  }

}
