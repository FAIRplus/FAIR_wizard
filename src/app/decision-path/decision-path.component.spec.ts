import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionPathComponent } from './decision-path.component';

describe('DecisionPathComponent', () => {
  let component: DecisionPathComponent;
  let fixture: ComponentFixture<DecisionPathComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionPathComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionPathComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
