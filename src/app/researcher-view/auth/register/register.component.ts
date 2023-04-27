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
    return pass === confirmPass ? null : { misMatch: true }
  }

  registerForm = new FormGroup({
    username: new FormControl<string>('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl<string>('', [Validators.required, Validators.minLength(6)]),
    passwordConfirmation: new FormControl<string>('', [Validators.required])
  }, {validators: this.checkPasswords});

  onRegister(): void {
    const {username, password} = this.registerForm.value;
    if(username && password)
    this.authService.register({username, password}).subscribe({
      next: (response) => {
        console.log(response.body?.message); //TODO: add messages to the user
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
