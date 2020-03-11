/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomItemInModalComponent } from './bom-item-in-modal.component';

describe('BomItemModalComponent', () => {
  let component: BomItemInModalComponent;
  let fixture: ComponentFixture<BomItemInModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomItemInModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomItemInModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
