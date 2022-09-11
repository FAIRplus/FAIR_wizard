import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsmModelComponent } from './dsm-model.component';

describe('DsmModelComponent', () => {
  let component: DsmModelComponent;
  let fixture: ComponentFixture<DsmModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsmModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsmModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
