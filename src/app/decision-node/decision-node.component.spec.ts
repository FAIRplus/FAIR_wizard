import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionNodeComponent } from './decision-node.component';

describe('DecisionNodeComponent', () => {
  let component: DecisionNodeComponent;
  let fixture: ComponentFixture<DecisionNodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DecisionNodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DecisionNodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
