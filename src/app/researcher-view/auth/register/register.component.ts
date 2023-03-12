import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  hide = true;

  constructor(private readonly authService: AuthService) {}


  checkPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('passwordConfirmation')?.value;
    return pass === confirmPass ? null : { notSame: true }
  }

  registerForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    passwordConfirmation: new FormControl<string>('', [Validators.required, this.checkPasswords])
  });

  onRegister(): void {
    console.log(this.registerForm.value);
    this.authService.register(this.registerForm.value).subscribe({
      next: (data) => {
        console.log(data.message);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
