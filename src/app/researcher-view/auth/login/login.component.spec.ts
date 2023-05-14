import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
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

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when username is missing', () => {
    component.loginForm.controls['username'].setValue('');
    expect(component.loginForm.controls['username'].valid).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('form should be invalid when password is missing', () => {
    component.loginForm.controls['password'].setValue('');
    expect(component.loginForm.controls['password'].valid).toBeFalsy();
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('form should be valid when username and password are provided', () => {
    component.loginForm.controls['username'].setValue('username');
    component.loginForm.controls['password'].setValue('password');
    expect(component.loginForm.controls['username'].valid).toBeTruthy();
    expect(component.loginForm.controls['password'].valid).toBeTruthy();
    expect(component.loginForm.valid).toBeTruthy();
  });
});
