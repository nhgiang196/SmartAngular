import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
declare var jQuery: any;
@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  show: boolean = false;
  data: any;
  currentUser: User;
  constructor(private router: Router, public authService: AuthService) {

  }
  toggleCollapse() {
    this.show = !this.show
  }
  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();
  }

  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  ngOnInit() {
  }

}
