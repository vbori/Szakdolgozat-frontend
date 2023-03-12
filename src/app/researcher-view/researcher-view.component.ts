import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-researcher-view',
  templateUrl: './researcher-view.component.html',
  styleUrls: ['./researcher-view.component.scss']
})
export class ResearcherViewComponent {
  constructor(private readonly authService: AuthService, private router: Router) {}
  onLogout(): void {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
