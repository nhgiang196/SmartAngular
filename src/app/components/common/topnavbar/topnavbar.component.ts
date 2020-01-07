import { Component, OnInit } from '@angular/core';
import { smoothlyMenu } from '../../../app.helpers';
import { AuthService } from 'src/app/services/auth.service';
import { EngineService } from 'src/app/services/engine.service';
import { Task } from 'src/app/models/camunda';
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
        , public engineApi: EngineService
        , public translate: TranslateService
        , private router : Router) {
    translate.addLangs(['en', 'vn', 'zh']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use(browserLang.match(/en|vn|zh/) ? (browserLang) : 'en');
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      var reloadpath = location.hash.replace('#','');
      this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
      this.router.navigate([  reloadpath ]));
    })
  }




  toggleNavigation(): void {
    jQuery("body").toggleClass("mini-navbar");
    smoothlyMenu();
  }
  ngOnInit() {
    this.allTasks();
  }
  logOut() {
    this.authService.logout();
  }
  public allTasks() {
    this.engineApi.loadAllTask(true);
    //set Timeout auto Reload Task list after 5 minute
    setTimeout(() => {
      this.engineApi.taskCount();
      this.engineApi.loadAllTask(true);
    }, 300000) // Activate after 5 minutes.

  }

}
