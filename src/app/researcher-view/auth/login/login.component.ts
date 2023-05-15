import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  hide = true;

  constructor(private readonly authService: AuthService, private router: Router,private toastr: ToastrService) { }

  loginForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required]),
    password: new FormControl<string>('', [Validators.required])
  });

  onLogin(): void {
    const {username, password} = this.loginForm.value;
    if(username && password)
    this.authService.login({username, password}).subscribe({
      next: () => {
        this.router.navigate(['/research/dashboard']);
        this.toastr.success('Logged in successfully', 'Success', { progressBar: true, positionClass: 'toast-bottom-right' });
      },
      error: (error) => {
        this.toastr.error(error.error, 'Error', { progressBar: true, positionClass: 'toast-bottom-right' });
      }
    });
  }
}
