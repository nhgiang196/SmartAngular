/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomStageModalComponent } from './bom-stage-modal.component';

describe('BomStageModalComponent', () => {
  let component: BomStageModalComponent;
  let fixture: ComponentFixture<BomStageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomStageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomStageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
