import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FairResourcesShowcaseComponent } from './fair-resources-showcase.component';

describe('FairResourcesShowcaseComponent', () => {
  let component: FairResourcesShowcaseComponent;
  let fixture: ComponentFixture<FairResourcesShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FairResourcesShowcaseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FairResourcesShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
