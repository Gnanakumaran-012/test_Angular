import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceInfo } from './price-info';

describe('PriceInfo', () => {
  let component: PriceInfo;
  let fixture: ComponentFixture<PriceInfo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceInfo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceInfo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
