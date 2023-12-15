import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetManagerComponent } from './asset-manager.component';

describe('AssetManagerComponent', () => {
  let component: AssetManagerComponent;
  let fixture: ComponentFixture<AssetManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssetManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
