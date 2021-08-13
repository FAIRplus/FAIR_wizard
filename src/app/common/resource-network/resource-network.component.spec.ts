import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResourceNetworkComponent } from './resource-network.component';

describe('ResourceNetworkComponent', () => {
  let component: ResourceNetworkComponent;
  let fixture: ComponentFixture<ResourceNetworkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResourceNetworkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
