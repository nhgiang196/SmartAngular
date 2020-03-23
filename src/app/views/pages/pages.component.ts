import { Component, OnInit } from '@angular/core';
import { minimalize } from 'src/app/app.helpers';

@Component({
  selector: 'app-pages',
  template: `<app-layout>
              <router-outlet></router-outlet>
            </app-layout>`
})
export class PagesComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit(){
    minimalize();
  }
}
