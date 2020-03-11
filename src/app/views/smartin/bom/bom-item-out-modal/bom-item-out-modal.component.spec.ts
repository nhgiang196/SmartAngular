/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomItemOutModalComponent } from './bom-item-out-modal.component';

describe('BomItemModalComponent', () => {
  let component: BomItemOutModalComponent;
  let fixture: ComponentFixture<BomItemOutModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomItemOutModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomItemOutModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
