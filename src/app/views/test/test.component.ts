import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  template: `
    <div class="wrapper">
      <div class="ibox-content">
      <app-form-edit></app-form-edit>
      <hr><app-customer-editor></app-customer-editor>
      <hr><app-crud-generation></app-crud-generation>
      <hr><app-customize-keyboard-navigation></app-customize-keyboard-navigation>

      <hr>
      </div>
    </div>
  `,
})
export class TestComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
