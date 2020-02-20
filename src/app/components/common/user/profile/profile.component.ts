import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: any = {};
  constructor(private router: ActivatedRoute, private authService: AuthService) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      console.log(params);
    });
    this.loadInfo();
    $('body').addClass('top-navigation');
  }

  ngAfterViewInit() {
    $('#lefNav').hide();
    $('#homeMenuButton').hide();

  }

  ngOnDestroy() {
    $('body').removeClass('top-navigation');
    $('#lefNav').show();
    $('#homeMenuButton').show();

  }
  loadInfo() {
    this.authService.profile().subscribe(res => {
      if (res[0] != null)
        this.profile = res[0] as any;
      else
        this.profile = {}
    });
  }
}
