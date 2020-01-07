import { Component, OnInit } from '@angular/core';
import { UserIdleService } from 'angular-user-idle';
import { AuthService } from './services/auth.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FEPV';
  constructor(private userIdle: UserIdleService,
    private auth: AuthService,
    public translate: TranslateService) {
      translate.addLangs(['en', 'vn']);
      translate.setDefaultLang('en');
  
      const browserLang = translate.getBrowserLang();
      translate.use(browserLang.match(/en|vn/) ? browserLang : 'en');     

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
