import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    this.router.params.subscribe(params => {
      console.log(params);
    });

    $('body').addClass('top-navigation');
  }

  ngAfterViewInit(){
    $('#lefNav').hide();
    $('#homeMenuButton').hide();

  }

  ngOnDestroy(){
    $('body').removeClass('top-navigation');
    $('#lefNav').show();
    $('#homeMenuButton').show();
    
  }

  

}
