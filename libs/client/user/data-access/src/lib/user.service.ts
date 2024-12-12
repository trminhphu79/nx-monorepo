import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Injectable } from '@angular/core';
import { UserSignInPayload, UserSignUpPayload } from './user.model';
import { of } from 'rxjs';
import { injectAppConfig } from '@client/utils/app-config';

@Injectable()
export class UserService {
  private http: HttpClient = inject(HttpClient);
  private appConfig = injectAppConfig();
  private baseUrl = this.appConfig.apiUrl + '/auth/';

  signIn(payload: UserSignInPayload) {
    return this.http.post(`${this.baseUrl}authenticate`, payload);
  }

  signUp(payload: UserSignUpPayload) {
    return this.http.post(`${this.baseUrl}registation`, payload);
  }
}
