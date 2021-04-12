import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetPanelComponent } from './facet-panel.component';

describe('FacetPanelComponent', () => {
  let component: FacetPanelComponent;
  let fixture: ComponentFixture<FacetPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacetPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
