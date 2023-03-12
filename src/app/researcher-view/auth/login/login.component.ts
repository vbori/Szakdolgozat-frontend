import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;

  constructor(private readonly authService: AuthService, private router: Router) { }

  loginForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required])
  });

  onLogin(): void {
    console.log(this.loginForm.value);
    this.authService.login(this.loginForm.value).subscribe({
      next: (data) => {
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
