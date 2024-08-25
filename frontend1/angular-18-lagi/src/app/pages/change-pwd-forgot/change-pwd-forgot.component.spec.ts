import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePwdForgotComponent } from './change-pwd-forgot.component';

describe('ChangePwdForgotComponent', () => {
  let component: ChangePwdForgotComponent;
  let fixture: ComponentFixture<ChangePwdForgotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChangePwdForgotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChangePwdForgotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
