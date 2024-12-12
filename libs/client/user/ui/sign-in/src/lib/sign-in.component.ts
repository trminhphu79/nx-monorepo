import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserSignInPayload } from '@client/user/data-access/model';

@Component({
  selector: 'lib-sign-in',
  standalone: true,
  imports: [CommonModule, ButtonModule, PasswordModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css',
})
export class SignInComponent {
  signIn = output<UserSignInPayload>();
  changeSignUpPage = output();
  forgotPassword = output();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  toSignUp() {
    this.changeSignUpPage.emit();
  }

  onSignIn() {
    if (this.form.invalid) {
      return;
    }
    this.signIn.emit(this.form.value);
  }

  onForgotPassword() {
    this.forgotPassword.emit(this.form.value);
  }
}
