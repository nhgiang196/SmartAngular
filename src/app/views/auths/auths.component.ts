import { Component, OnInit } from '@angular/core';
import { changeColorBody } from 'src/app/app.helpers';

@Component({
  selector: 'app-auths',
  template:` <router-outlet></router-outlet>`
})
export class AuthsComponent implements OnInit{
  ngOnInit(): void {

  }
  ngAfterViewInit(){
    changeColorBody('gray-bg');
  }
}
