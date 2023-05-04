import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RegisterComponent } from './register.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let toastrServiceSpy: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      imports: [
        ReactiveFormsModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        NoopAnimationsModule ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: ToastrService, useValue: toastrSpy }
      ]
    })
    .compileComponents();

    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    toastrServiceSpy = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
