import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairResourceComponent } from './fair-resource.component';

describe('FairResourceComponent', () => {
  let component: FairResourceComponent;
  let fixture: ComponentFixture<FairResourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FairResourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FairResourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
