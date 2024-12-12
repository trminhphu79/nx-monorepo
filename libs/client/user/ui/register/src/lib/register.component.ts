import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserSignUpPayload } from '@client/user/data-access/model';
@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    ReactiveFormsModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  signUp = output<UserSignUpPayload>();
  changeSignInPage = output();
  forgotPassword = output();

  form: FormGroup = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
  });

  toSignIn() {
    this.changeSignInPage.emit();
  }

  onSignUp() {
    if (this.form.invalid) {
      return;
    }
    this.signUp.emit(this.form.value);
  }

  onForgotPassword() {
    this.forgotPassword.emit(this.form.value);
  }
}
