import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessManagerComponent } from './business-manager.component';

describe('BusinessManagerComponent', () => {
  let component: BusinessManagerComponent;
  let fixture: ComponentFixture<BusinessManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
