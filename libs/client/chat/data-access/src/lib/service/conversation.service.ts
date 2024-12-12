import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { injectAppConfig } from '@client/utils/app-config';
import { Conversation } from '@shared/models/conversation';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConversationApi {
  http = inject(HttpClient);
  appConfig = injectAppConfig();
  baseUrl: string | undefined = '';

  constructor() {
    this.baseUrl = this.appConfig.apiUrl + '/';
  }

  getConversations(
    payload: { profileId: number; limit: number } = { limit: 10, profileId: -1 }
  ) {
    return this.http.post<{ data: Conversation[] }>(
      `${this.baseUrl}conversation/search`,
      payload
    );
  }
}
