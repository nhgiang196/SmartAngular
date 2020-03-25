/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BomStageComponent } from './bom-stage.component';

describe('BomStageComponent', () => {
  let component: BomStageComponent;
  let fixture: ComponentFixture<BomStageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BomStageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BomStageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
