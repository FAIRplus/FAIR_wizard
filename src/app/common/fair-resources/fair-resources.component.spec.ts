import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairResourcesComponent } from './fair-resources.component';

describe('FairResourcesComponent', () => {
  let component: FairResourcesComponent;
  let fixture: ComponentFixture<FairResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FairResourcesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FairResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
