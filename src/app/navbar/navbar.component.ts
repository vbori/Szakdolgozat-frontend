import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../researcher-view/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  isToggled = false;
  isLoggedIn = false;

  constructor(private readonly authService: AuthService, private readonly router: Router) {
    this.authService.isLoggedIn$.subscribe((isLoggedIn : boolean) => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  logout(){
    this.authService.logout().subscribe({
      next: () => {
        this.isToggled = false;
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      }
    })
  }
}
