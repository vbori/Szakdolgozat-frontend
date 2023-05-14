import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule} from '@angular/router/testing';
import { MatIconModule } from '@angular/material/icon';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [HttpClientTestingModule,
                RouterTestingModule,
                MatIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not show profile button when user is not logged in', () => {
    component.isLoggedIn = false;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#navbarDropdownMenuLink')).toBeFalsy();
  });

  it('should show profile button when user is logged in', () => {
    component.isLoggedIn = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('#navbarDropdownMenuLink')).toBeTruthy();
  });

});
