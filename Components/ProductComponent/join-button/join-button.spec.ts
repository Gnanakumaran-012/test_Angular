import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinButton } from './join-button';

describe('JoinButton', () => {
  let component: JoinButton;
  let fixture: ComponentFixture<JoinButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JoinButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JoinButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
