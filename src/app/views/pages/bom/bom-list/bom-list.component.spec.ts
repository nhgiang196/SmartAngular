/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomListComponent } from './bom-list.component';

describe('BomListComponent', () => {
  let component: BomListComponent;
  let fixture: ComponentFixture<BomListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
