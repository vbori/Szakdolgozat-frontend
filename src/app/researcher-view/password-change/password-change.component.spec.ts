import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PasswordChangeComponent } from './password-change.component';

describe('PasswordChangeComponent', () => {
  let component: PasswordChangeComponent;
  let fixture: ComponentFixture<PasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PasswordChangeComponent ],
      imports: [
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        ReactiveFormsModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [ToastrService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when new password is less than 6 characters long', () => {
    component.passwordForm.controls['newPassword'].setValue('ab');
    expect(component.passwordForm.controls['newPassword'].valid).toBeFalsy();
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('form should be invalid when old password is less than 6 characters long', () => {
    component.passwordForm.controls['oldPassword'].setValue('ab');
    expect(component.passwordForm.controls['oldPassword'].valid).toBeFalsy();
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('form should be invalid when old password is missing', () => {
    component.passwordForm.controls['oldPassword'].setValue('');
    expect(component.passwordForm.controls['oldPassword'].valid).toBeFalsy();
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('form should be invalid when new password is missing', () => {
    component.passwordForm.controls['newPassword'].setValue('');
    expect(component.passwordForm.controls['newPassword'].valid).toBeFalsy();
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('form should be invalid when password confirmation does not match new password', () => {
    component.passwordForm.controls['newPassword'].setValue('password1');
    component.passwordForm.controls['passwordConfirmation'].setValue('password2');
    expect(component.passwordForm.valid).toBeFalsy();
  });

  it('should enable "Change password" button when form is valid', () => {
    component.passwordForm.controls['oldPassword'].setValue('password1');
    component.passwordForm.controls['newPassword'].setValue('password2');
    component.passwordForm.controls['passwordConfirmation'].setValue('password2');
    expect(component.passwordForm.valid).toBeTruthy();
  });
});
