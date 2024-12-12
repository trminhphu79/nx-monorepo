import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from '@client/app-shell';
import { INITIAL_APP_STATE } from './app.state';
import { provideHttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { provideSocketAdapter } from '@client/utils/socket';
import { provideAppState } from '@client/store/token';
import { provideAppConfig } from '@client/utils/app-config';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideAppState(INITIAL_APP_STATE),
    provideAppConfig(environment),
    provideSocketAdapter(),
    provideAnimations(),
    importProvidersFrom(MessageService),
    provideRouter(appRoutes, withViewTransitions()),
    provideZoneChangeDetection({ eventCoalescing: true }),
  ],
};
