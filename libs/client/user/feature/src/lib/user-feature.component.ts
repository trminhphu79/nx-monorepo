import { AppStore } from '@client/store/store';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { SignInComponent } from '@client/user/sign-in';
import { RegisterComponent } from '@client/user/register';
import { ToastModule } from 'primeng/toast';
import { UserService } from '@client/user/data-access/service';
import { catchError, delay, EMPTY, map, switchMap, tap } from 'rxjs';
import {
  UserSignInPayload,
  UserSignUpPayload,
} from '@client/user/data-access/model';
import { ToastService } from '@client/utils/toast';
import { MessageService } from 'primeng/api';
import { ProfileService } from '@client/profile/service';
import { ConversationStore } from '@client/chat/data-access/conversation';
@Component({
  selector: 'lib-user-feature',
  standalone: true,
  imports: [
    ToastModule,
    CommonModule,
    ButtonModule,
    PasswordModule,
    SignInComponent,
    RegisterComponent,
    ReactiveFormsModule,
  ],
  providers: [UserService, ToastService, MessageService],
  templateUrl: './user-feature.component.html',
  styleUrl: './user-feature.component.css',
})
export class UserFeatureComponent {
  private router = inject(Router);
  private service = inject(UserService);
  private appState = inject(AppStore);
  private toastService = inject(ToastService);
  private profileService = inject(ProfileService);
  private conversationStore = inject(ConversationStore);

  protected screenState = signal('SIGN_IN');

  protected signIn(value: UserSignInPayload) {
    this.service
      .signIn(value)
      .pipe(
        catchError(() => {
          this.toastService.showMessage(
            'error',
            'Username or password incorrect!'
          );
          return EMPTY;
        }),
        tap(() => {
          this.toastService.showMessage('success', 'Login success!');
        }),
        switchMap((response: any) => {
          return this.profileService.getUserFriends(response.id).pipe(
            map((userFriend) => {
              return {
                ...response,
                profile: userFriend,
              };
            })
          );
        }),
        delay(500),
        tap((response) => {
          this.appState.setUser({ ...response, isAuthenticated: true });
          this.conversationStore.getConversations();
          this.conversationStore.registerNewMessageConversation();
          this.router.navigate(['/']);
        })
      )
      .subscribe();
  }

  protected signUp(value: UserSignUpPayload) {
    this.service
      .signUp(value)
      .pipe(
        catchError(() => {
          this.toastService.showMessage('error', 'Register User Failed!');
          return EMPTY;
        }),
        tap((response: any) => {
          this.toastService.showMessage(
            'success',
            response.message || 'Success!'
          );
        }),
        delay(500),
        tap(() => {
          this.changePage('SIGN_IN');
        })
      )
      .subscribe();
  }

  protected forgotPassword() {
    console.log('Forgot Password Clicked');
  }

  protected changePage(value: string) {
    this.screenState.set(value);
  }
}
