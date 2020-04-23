import { Component } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthService } from './core/services';
import { Router } from '@angular/router';
import { LanguageService } from './core/services/language.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent {
  title = 'XLNT-SPA';

  constructor(
    private userIdle: UserIdleService,
    private auth: AuthService,
    public translate: TranslateService,
    public router: Router,
    private langService: LanguageService
    ) {
      translate.use(langService.getLanguage());
  }
  

  ngOnInit() {  

    //Start watching for user inactivity.
    this.startWatching();

    // Start watching when user idle is starting.
    this.userIdle.onTimerStart().subscribe(count => {
      this.auth.logout();
      this.restart();
    });
  }
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  restart() {
    this.userIdle.resetTimer();
  }

}
